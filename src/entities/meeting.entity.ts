import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { ChangeLog } from './change-log.entity';

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

  @Column({ default: MeetingStatus.Todo, enum: MeetingStatus, type: 'enum' })
  status: MeetingStatus;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @Column({ default: false })
  archived: boolean;

  @ManyToOne(() => User)
  @JoinColumn([{ referencedColumnName: 'id', name: 'created_by_id' }])
  createdBy: User;

  @OneToMany(() => Comment, (comment) => comment.meeting)
  comments: Comment[];

  @OneToMany(() => ChangeLog, (changeLog) => changeLog.meeting)
  changeLogs: ChangeLog[];
}
