import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Classrooms } from './Classrooms';
import { Users } from './Users';

@Index('UserId', ['UserId'], {})
@Entity('classroommembers', { schema: 'nestsolbon' })
export class ClassroomMembers {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { primary: true, name: 'ClassroomId' })
  ClassroomId: number;

  @Column('int', { primary: true, name: 'UserId' })
  UserId: number;

  @Column('datetime', { name: 'loggedInAt', nullable: true })
  loggedInAt: Date | null;

  @ManyToOne(() => Classrooms, (classrooms) => classrooms.ClassroomMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ClassroomId', referencedColumnName: 'id' }])
  Classroom: Classrooms;

  @ManyToOne(() => Users, (users) => users.ClassroomMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;
}