import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '../auth/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    const password = await this.hashingService.hash(payload.password);
    const user = await this.userRepository.save({ ...payload, password });

    return {
      ...user,
      password: undefined,
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'name', 'email', 'password', 'imageUrl'],
      where: { email },
    });
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
