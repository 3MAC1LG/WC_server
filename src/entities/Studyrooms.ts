import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chats } from './Chats';
import { Users } from './Users';
import { Classrooms } from './Classrooms';
import { Videos } from './Videos';
import { StudyroomMembers } from './StudyroomMembers';

@Entity({ schema: 'wc_server', name: 'studyrooms' })
export class Studyrooms {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 30 })
  title: string;

  @Column('varchar', { name: 'Thumburl', length: 30, nullable: true })
  thumbUrl: string;

  @Column('varchar', {
    name: 'password',
    length: 100,
    select: false,
    nullable: true,
  })
  password: string;

  @Column('varchar', { name: 'private' })
  private: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number;

  @OneToMany(() => Chats, (chats) => chats.Studyroom)
  Chats: Chats[];

  @Column('int', { name: 'ClassroomId', nullable: true })
  ClassroomId: number;

  @Column('int', { name: 'VideoId', nullable: true })
  VideoId: number;

  @OneToMany(
    () => StudyroomMembers,
    (studyroommembers) => studyroommembers.Studyroom,
    { cascade: ['insert'] },
  )
  StudyroomMembers: StudyroomMembers[];

  @ManyToOne(() => Videos, (video) => video.Studyrooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'VideoId', referencedColumnName: 'id' }])
  Video: Videos;

  @ManyToOne(() => Classrooms, (classroom) => classroom.Studyrooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ClassroomId', referencedColumnName: 'id' }])
  Classroom: Classrooms;

  @ManyToOne(() => Users, (users) => users.OwnedStudyrooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  Owner: Users;
}
