import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudyroomMembers } from './StudyroomMembers';
import { Chats } from './Chats';
import { Qnas } from './Qnas';
import { ClassroomMembers } from './ClassroomMembers';
import { Classrooms } from './Classrooms';
import { Studyrooms } from './Studyrooms';
import { Wishlists } from './Wishlists';

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'nestsolbon', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @Column('varchar', { name: 'provider', default: 'local' })
  provider: string;

  @Column('int', { name: 'snsId', unique: true })
  snsId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => Wishlists, (wishlist) => wishlist.User)
  Users: Users[];

  @OneToMany(() => Chats, (chats) => chats.Sender)
  Chats: Chats[];

  @OneToMany(() => Chats, (chats) => chats.Receiver)
  Chats2: Chats[];

  @OneToMany(() => Qnas, (qnas) => qnas.Sender)
  Qnas: Qnas[];

  @OneToMany(() => Qnas, (qnas) => qnas.Receiver)
  Qnas2: Qnas[];

  @OneToMany(
    () => ClassroomMembers,
    (classroommembers) => classroommembers.User,
  )
  ClassroomMembers: ClassroomMembers[];

  @OneToMany(() => Classrooms, (classrooms) => classrooms.Owner)
  OwnedClassrooms: Classrooms[];

  @JoinTable({
    name: 'classroommembers',
    joinColumn: {
      name: 'UserId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ClassroomId',
      referencedColumnName: 'id',
    },
  })
  Classrooms: Classrooms[];

  @OneToMany(
    () => StudyroomMembers,
    (studyroommembers) => studyroommembers.User,
  )
  StudyroomMembers: StudyroomMembers[];

  @OneToMany(() => Studyrooms, (studyrooms) => studyrooms.Owner)
  OwnedStudyrooms: Studyrooms[];
}
