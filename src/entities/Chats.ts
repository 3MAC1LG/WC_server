import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Studyrooms } from './Studyrooms';
import { Users } from './Users';

@Index('UserId', ['UserId'], {})
@Index('StudyroomId', ['StudyroomId'], {})

@Entity({ schema: 'wc_server', name: 'chats' })
export class Chats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number | null;

  @Column('int', { name: 'StudyroomId' })
  StudyroomId: number | null;

  @Column('int', { name: 'UserId', nullable: true })
  UserId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Studyrooms, (studyroom) => studyroom.Chats)
  @JoinColumn({ name: 'StudyroomId', referencedColumnName: 'id' })
  Studyroom: Studyrooms;

  @ManyToOne(() => Users, (users) => users.Chats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  Sender: Users;

  @ManyToOne(() => Users, (users) => users.Chats2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  Receiver: Users;
}
