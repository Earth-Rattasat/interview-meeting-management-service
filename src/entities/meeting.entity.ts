import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

export enum MeetingStatus {
  Todo = 'TODO',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
}

@Entity({ name: 'meeting' })
export class Meeting extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: MeetingStatus.Todo, enum: MeetingStatus })
  status: MeetingStatus;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ default: false })
  archived: boolean;

  @ManyToOne(() => User)
  @JoinColumn([{ referencedColumnName: 'id', name: 'created_by' }])
  creator: User;
}
