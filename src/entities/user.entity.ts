import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Meeting } from './meeting.entity';

@Entity({ name: 'user' })
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @OneToMany(() => Meeting, (meeting) => meeting.createdBy)
  meetings: Meeting[];
}
