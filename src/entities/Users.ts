import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Sections } from './Sections';
import { DMs } from './Chats';
import { Mentions } from './Qnas';
import { ClassroomMembers } from './ClassroomMembers';
import { Classrooms } from './Classrooms';
import { Studyrooms } from './Studyrooms';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'nestsolbon', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @Column('varchar', { name: 'provider', default: 'local' })
  provider: string;

  @Column('int', { name: 'snsId', unique: true })
  snsId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.User)
  ChannelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.User)
  ChannelMembers: ChannelMembers[];

  @OneToMany(() => Chats, (chats) => chats.Sender)
  Chats: Chats[];

  @OneToMany(() => Chats, (chats) => chats.Receiver)
  Chats2: Chats[];

  @OneToMany(() => Qnas, (qnas) => qnas.Sender)
  Mentions: Mentions[];

  @OneToMany(() => Mentions, (mentions) => mentions.Receiver)
  Mentions2: Mentions[];

  @OneToMany(
    () => ClassroomMembers,
    (classroommembers) => classroommembers.User,
  )
  ClassroomMembers: ClassroomMembers[];

  @OneToMany(() => Classrooms, (classrooms) => classrooms.Owner)
  OwnedClassrooms: Classrooms[];

  @ManyToMany(() => Classrooms, (classrooms) => classrooms.Members)

  @JoinTable({
    name: 'classroommembers',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ClassroomId',
      referencedColumnName: 'id',
    },
  })
  Classrooms: Classrooms[];

  @OneToMany(
    () => StudyroomMembers,
    (studyroommembers) => studyroommembers.User,
  )
  StudyroomMembers: StudyroomMembers[];

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Owner)
  OwnedStudyrooms: Studyrooms[];

  @ManyToMany(() => Studyrooms, (studyrooms) => studyrooms.Members)

  @JoinTable({
    name: 'studyroommembers',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'StudyroomId',
      referencedColumnName: 'id',
    },
  })
  Studyrooms: Studyrooms[];

  @ManyToMany(() => Sections, (setions) => sections.Members)
  @JoinTable({
    name: 'channelmembers',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ChannelId',
      referencedColumnName: 'id',
    },
  })
  Channels: Channels[];
}
