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
import { Channels } from './Channels';
import { DMs } from './DMs';
import { Mentions } from './Mentions';
import { ClassroomMembers } from './ClassroomMembers';
import { Classrooms } from './Classrooms';

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

  @OneToMany(() => DMs, (dms) => dms.Sender)
  DMs: DMs[];

  @OneToMany(() => DMs, (dms) => dms.Receiver)
  DMs2: DMs[];

  @OneToMany(() => Mentions, (mentions) => mentions.Sender)
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

  @ManyToMany(() => Channels, (channels) => channels.Members)
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