import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassroomMembers } from './ClassroomMembers';
import { Sections } from './Sections';
import { Studyrooms } from './Studyrooms';
import { Users } from './Users';

@Entity({ schema: 'wc_server', name: 'classrooms' })
export class Classrooms {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('varchar', { name: 'desc', length: 30 })
  desc: string;

  @Column('varchar', { name: 'category' })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'OwnerId' })
  OwnerId: number;

  @OneToMany(
    () => ClassroomMembers,
    (classroommembers) => classroommembers.Classroom,
    { cascade: ['insert'] },
  )
  ClassroomMembers: ClassroomMembers[];

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Classroom)
  Studyrooms: Studyrooms[];

  @OneToMany(() => Sections, (section) => section.Classroom)
  Sections: Sections[];

  @ManyToOne(() => Users, (users) => users.OwnedClassrooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  Owner: Users;
}
