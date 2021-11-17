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
import { Chats } from './Chats';
import { StudyroomMembers } from './StudyroomMembers';
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

  @Column('varchar', { name: 'Title', unique: true, length: 30 })
  Title: string;

  @Column('varchar', { name: 'Thumburl', unique: true, length: 30 })
  Thumburl: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @Column('varchar', { name: 'private', length: 100, select: false })
  private: string; /** ????? 맞나? */

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
    () => StudyroomMembers,
    (studyroomMembers) => studyroomMembers.Studyroom,
    { cascade: ['insert'] },
  )
  StudyroomMembers: StudyroomMembers[];

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
 }