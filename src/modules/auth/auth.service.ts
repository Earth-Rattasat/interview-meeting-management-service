import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

interface JWTPayload {
  id: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async login(payload: LoginDto): Promise<AuthTokens> {
    try {
      const user = await this.userService.getUserByEmail(payload.email);
      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const passwordIsValid = await this.hashingService.compare(
        payload.password,
        user.password,
      );

      if (!passwordIsValid) {
        throw new HttpException('Invalid password', 400);
      }
      return this.generateTokens(user);
    } catch (error) {
      throw new HttpException(error.message, error.status ?? 500);
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    try {
      const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
        },
      );
      const user = await this.userService.getUserById(id);
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });

      return {
        id: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  private async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
