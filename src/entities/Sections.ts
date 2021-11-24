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
import { Videos } from './Videos';
import { Classrooms } from './Classrooms';

@Entity({ schema: 'wc_server', name: 'sections' })
export class Sections {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 30 })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  DeleteAt: Date;

  @Column('int', { name: 'ClassroomId' })
  ClassroomId: number;

  @OneToMany(() => Videos, (videos) => videos.Section)
  Videos: Videos[];

  @ManyToOne(() => Classrooms, (classroom) => classroom.Sections, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ClassroomId', referencedColumnName: 'id' }])
  Classroom: Classrooms;
}
