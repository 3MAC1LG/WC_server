import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Studyrooms } from './Studyrooms';
import { Users } from './Users';

@Index('ClassroomId', ['ClassroomId'], {})
@Index('dms_ibfk_2', ['SenderId'], {})
@Index('dms_ibfk_3', ['ReceiverId'], {})
@Entity({ schema: 'nestsolbon', name: 'chats' })
export class Wishlists {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'ClassroomId', nullable: true })
  ClassroomId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  SenderId: number | null;

  @Column('int', { name: 'ReceiverId', nullable: true })
  ReceiverId: number | null;

  @ManyToOne(() => Users, (users) => user.Wishlist, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  User: Users;

}