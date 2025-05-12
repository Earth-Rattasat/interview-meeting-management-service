import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { User } from 'src/entities/user.entity';
import { GetMeetingsDto } from './dto/get-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private readonly meetingRepository: Repository<Meeting>,
  ) {}

  async createMeeting(payload: CreateMeetingDto, user: User) {
    return this.meetingRepository.save({
      ...payload,
      createdById: user.id,
    });
  }

  async getMeetings(payload: GetMeetingsDto): Promise<[Meeting[], number]> {
    const { page = 1, pageSize = 10 } = payload;
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.createdBy', 'createdBy')
      .where('meeting.archived = false')
      .orderBy('meeting.createdAt', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }

  async getMeetingById(id: string): Promise<Meeting> {
    return this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.createdBy', 'createdBy')
      .leftJoinAndSelect('meeting.comments', 'comment')
      .leftJoinAndSelect('meeting.changeLogs', 'changeLog')
      .where('meeting.id = :id', { id })
      .addOrderBy('comment.createdAt', 'DESC')
      .addOrderBy('changeLog.createdAt', 'DESC')
      .getOne();
  }

  async updateMeeting(id: string, payload: UpdateMeetingDto) {
    const { archive, ...rest } = payload;

    await this.meetingRepository.save({
      id,
      ...rest,
      archived: archive,
    });

    return this.meetingRepository.findOneByOrFail({ id });
  }
}
