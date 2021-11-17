import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Classrooms } from './Classrooms';
import { Comments } from './Comments';
import { Users } from './Users';
import { Videos } from './Videos';

@Index('ClassroomId', ['ClassroomId'], {})
@Index('SenderId', ['SenderId'], {})
@Index('ReceiverId', ['ReceiverId'], {})
@Entity({ schema: 'nestsolbon', name: 'qnas' })
export class Qnas {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] })
  type: 'chat' | 'dm' | 'system';

  @Column('int', { name: 'ChatId', nullable: true })
  ChatId: number | null;

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

  @OneToMany(() => Comments, (comments) => comments.Qnas)
  Comments: Comments;

  @ManyToOne(() => Videos, (video) => video.Qnas, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ClassroomId', referencedColumnName: 'id' }])
  Video: Videos;

  @ManyToOne(() => Users, (users) => users.Qnas, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  Sender: Users;

  @ManyToOne(() => Users, (users) => users.Qnas2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  Receiver: Users;
}