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
  Index,
} from 'typeorm';
import { ClassroomMembers } from './ClassroomMembers';
import { Sections } from './Sections';
import { Studyrooms } from './Studyrooms';
import { Users } from './Users';

@Index('name', ['name'], { unique: true })
@Index('url', ['url'], { unique: true })
@Index('OwnerId', ['OwnerId'], {})
@Entity({ schema: 'wc_server', name: 'classrooms' })
export class Classrooms {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('varchar', { name: 'desc', length: 30 })
  desc: string;

<<<<<<< HEAD
  @Column('varchar', { name: 'category' })
  category: string;
=======
  @Column('varchar', { name: 'sections', unique: true, length: 30 })
  sections: number; ///이건 나중에 sections 컨트롤러에서 바꿔야함
>>>>>>> cb42ca587abf964cc9d9fd28c39d67f58a5b0837

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
