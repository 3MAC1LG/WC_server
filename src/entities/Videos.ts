import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Studyrooms } from './Studyrooms';
import { Sections } from './Sections';
import { Qnas } from './Qnas';

@Entity({ schema: 'wc_server', name: 'videos' })
export class Videos {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'Title', length: 30 })
  title: string;

  @Column('varchar', { name: 'Videourl', unique: true, length: 30 })
  tideourl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column('int', { name: 'SectionId', nullable: true })
  SectionId: number | null;

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Video, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  Studyrooms: Studyrooms[];

  @OneToMany(() => Qnas, (qnas) => qnas.Video, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  Qnas: Qnas[];

  @ManyToOne(() => Sections, (section) => section.Videos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  Sections: Sections[];

  @ManyToOne(() => Sections, (section) => section.Videos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SectionId', referencedColumnName: 'id' }])
  Section: Sections;
}
