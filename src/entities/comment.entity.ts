import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { Meeting } from './meeting.entity';
import { User } from './user.entity';

@Entity({ name: 'comment' })
export class Comment extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'meeting_id' })
  meetingId: string;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @Column()
  description: string;

  @ManyToOne(() => Meeting)
  @JoinColumn([{ referencedColumnName: 'id', name: 'meeting_id' }])
  meeting: Meeting;

  @ManyToOne(() => User)
  @JoinColumn([{ referencedColumnName: 'id', name: 'created_by_id' }])
  createdBy: User;
}
