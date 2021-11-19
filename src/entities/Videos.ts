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
  Title: string;

  @Column('varchar', { name: 'Videourl', unique: true, length: 30 })
  Videourl: string;

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

  @DeleteDateColumn()
  DeleteAt: Date;

  @Column('int', { name: 'SectionId', nullable: true })
  SectionId: number | null;

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

  @ManyToOne(() => Sections, (section) => section.Videos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SectionId', referencedColumnName: 'id' }])
  Section: Sections;
}
