import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Meeting, MeetingStatus } from './meeting.entity';

@Entity({ name: 'change_log' })
export class ChangeLog extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'meeting_id' })
  meetingId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ enum: MeetingStatus })
  status: MeetingStatus;

  @ManyToOne(() => Meeting)
  @JoinColumn([{ referencedColumnName: 'id', name: 'meeting_id' }])
  meeting: Meeting;
}
