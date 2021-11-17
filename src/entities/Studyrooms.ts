import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sections } from './Sections';
import { Chats } from './Chats';
import { Qnas } from './Qnas';
import { ClassroomMembers } from './ClassroomMembers';
import { Users } from './Users';
import { Classrooms } from './Classrooms';
import { Videos } from './Videos';

@Index('name', ['name'], { unique: true })
@Index('url', ['url'], { unique: true })
@Index('OwnerId', ['OwnerId'], {})
@Entity({ schema: 'nestsolbon', name: 'classrooms' })
export class Studyrooms {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @Column('varchar', { name: 'url', unique: true, length: 30 })
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number | null;

  @OneToMany(() => Chats, (chats) => chats.Studyroom)
  Chats: Chats[];

  @OneToMany(
    () => ClassroomMembers,
    (classroommembers) => classroommembers.Classroom,
    { cascade: ['insert'] },
  )
  ClassroomMembers: ClassroomMembers[];

  @ManyToOne(() => Videos, (video) => video.Studyrooms,{
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  Video: Videos;

  @ManyToOne(() => Classrooms, (classroom) => classroom.Studyrooms,{
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  Classroom: Classrooms;

  @ManyToOne(() => Users, (users) => users.Studyrooms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  Owner: Users;

  @ManyToMany(() => Users, (users) => users.Studyrooms)
  Members: Users[];
 }