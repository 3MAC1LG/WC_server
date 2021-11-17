import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Users } from './Users';
import { Studyrooms } from './Studyrooms';
import { Sections } from './Sections';
import { Qnas } from './Qnas';

@Entity({ schema: 'nestsolbon', name: 'video' })
export class Videos {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('tinyint', {
    name: 'private',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'ClassroomId', nullable: true })
  ClassroomId: number | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.Channel)
  ChannelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelMembers) => channelMembers.Section, {
    cascade: ['insert'],
  })
  ChannelMembers: ChannelMembers[];

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Video, {
    cascade: ['insert'],
  })
  Studyrooms: Studyrooms[];

  @OneToMany(() => Qnas, (qnas) => qnas.Video, {
    cascade: ['insert'],
  })
  Qnas: Qnas[];

  @ManyToOne(() => Sections, (section) => section.Videos, {
    cascade: ['insert'],
  })
  Sections: Sections[];

  @ManyToMany(() => Users, (users) => users.Channels)
  Members: Users[];

  @ManyToOne(() => Sections, (section) => section.Videos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ClassroomId', referencedColumnName: 'id' }])
  Section: Sections;
}