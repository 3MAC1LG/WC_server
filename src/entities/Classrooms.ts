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
import { Studyrooms } from './Studyrooms';
import { Chats } from './Chats';
import { Qnas } from './Qnas';
import { ClassroomMembers } from './ClassroomMembers';
import { Users } from './Users';

@Index('name', ['name'], { unique: true })
@Index('url', ['url'], { unique: true })
@Index('OwnerId', ['OwnerId'], {})
@Entity({ schema: 'nestsolbon', name: 'classrooms' })
export class Classrooms {
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

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Classroom)
  Studyrooms: Studyrooms[];

  @OneToMany(() => Sections, (sections) => sections.Classroom)
  Sections: Sections[];

  @OneToMany(
    () => ClassroomMembers,
    (classroommembers) => classroommembers.Classroom,
    { cascade: ['insert'] },
  )
  ClassroomMembers: ClassroomMembers[];

  @ManyToOne(() => Users, (users) => users.Classrooms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  Owner: Users;

  @ManyToMany(() => Users, (users) => users.Classrooms)
  Members: Users[];
 } 