import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Studyrooms } from './Studyrooms';
import { Users } from './Users';

@Index('UserId', ['UserId'], {})
@Entity({ schema: 'nestsolbon', name: 'studyroommembers' })
export class StudyroomMembers {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { primary: true, name: 'ChannelId' })
  ChannelId: number;

  @Column('int', { primary: true, name: 'UserId' })
  UserId: number;

  @ManyToOne(() => Studyrooms, (studyroom) => studyroom.StudyroomMembers,{
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  Studyroom: Studyrooms;

  @ManyToOne(() => Users, (users) => users.StudyroomMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;
}