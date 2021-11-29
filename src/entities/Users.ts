import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chats } from './Chats';
import { Qnas } from './Qnas';
import { ClassroomMembers } from './ClassroomMembers';
import { Classrooms } from './Classrooms';
import { Studyrooms } from './Studyrooms';
import { Wishlists } from './Wishlists';
import { StudyroomMembers } from './StudyroomMembers';
import { Comments } from './Comments';

@Entity({ schema: 'wc_server', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30, nullable: true })
  nickname: string;

  @Column('varchar', { name: 'profileImg', nullable: true })
  profileImg: string;

  @Column('varchar', {
    name: 'password',
    length: 100,
    select: false,
    nullable: true,
  })
  password: string;

  @Column('varchar', { name: 'provider', default: 'local' })
  provider: string;

  @Column('int', { name: 'snsId', nullable: true })
  snsId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => Wishlists, (wishlist) => wishlist.User)
  wishLists: Wishlists[];

  @OneToMany(() => Chats, (chats) => chats.User)
  Chats: Chats[];

  @OneToMany(() => Qnas, (qnas) => qnas.Sender)
  Qnas: Qnas[];

  @OneToMany(() => Qnas, (qnas) => qnas.Receiver)
  Qnas2: Qnas[];

  @OneToMany(() => Comments, (comment) => comment.User)
  Comments: Comments[];

  @OneToMany(
    () => ClassroomMembers,
    (classroommembers) => classroommembers.User,
  )
  ClassroomMembers: ClassroomMembers[];

  @OneToMany(() => StudyroomMembers, (studyroommbers) => studyroommbers.User)
  StudyroomMembers: StudyroomMembers[];

  @OneToMany(() => Classrooms, (classrooms) => classrooms.Owner)
  OwnedClassrooms: Classrooms[];

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Owner)
  OwnedStudyrooms: Studyrooms[];
}
