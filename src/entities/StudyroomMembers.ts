import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Studyrooms } from './Studyrooms';
import { Users } from './Users';

@Entity({ schema: 'wc_server', name: 'studyroommembers' })
export class StudyroomMembers {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { primary: true, name: 'StudyroomId' })
  StudyroomId: number;

  @Column('int', { primary: true, name: 'UserId' })
  UserId: number;

  @ManyToOne(() => Users, (users) => users.StudyroomMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @ManyToOne(() => Studyrooms, (studyroom) => studyroom.StudyroomMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'StudyroomId', referencedColumnName: 'id' }])
  Studyroom: Studyrooms;
}
