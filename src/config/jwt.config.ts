import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default registerAs('jwt', () => {
  return {
    secret: configService.get<string>('JWT_SECRET_KEY'),
    accessTokenTtl: parseInt(
      configService.get<string>('JWT_ACCESS_TOKEN_TTL') ?? '3600',
      10,
    ),
    refreshTokenTtl: parseInt(
      configService.get<string>('JWT_REFRESH_TOKEN_TTL') ?? '86400',
      10,
    ),
  };
});
