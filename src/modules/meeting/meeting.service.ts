import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { User } from 'src/entities/user.entity';
import { GetMeetingsDto } from './dto/get-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  async createMeeting(payload: CreateMeetingDto, user: User) {
    return this.meetingRepository.save({
      ...payload,
      createdBy: user.id,
    });
  }

  async getMeetings(payload: GetMeetingsDto): Promise<[Meeting[], number]> {
    const { page = 1, pageSize = 10 } = payload;
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.creator', 'creator')
      .orderBy('meeting.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }

  async getMeetingById(id: string): Promise<Meeting> {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.creator', 'creator')
      .leftJoinAndSelect('meeting.comments', 'comment')
      .leftJoinAndSelect('meeting.changeLogs', 'changeLog')
      .where('meeting.id = :id', { id })
      .getOne();
  }
}
