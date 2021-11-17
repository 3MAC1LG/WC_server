import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Qnas } from './Qnas';

@Index('ClassroomId', ['ClassroomId'], {})
@Index('dms_ibfk_2', ['SenderId'], {})
@Index('dms_ibfk_3', ['ReceiverId'], {})
@Entity({ schema: 'nestsolbon', name: 'chats' })
export class Comments {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number | null;

  @Column('text', { name: 'contents' })
  contents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  DeleteAt: Date;

  @Column('int', { name: 'ClassroomId', nullable: true })
  ClassroomId: number | null;

/*   @Column('int', { name: 'SenderId', nullable: true })
  SenderId: number | null;

  @Column('int', { name: 'ReceiverId', nullable: true })
  ReceiverId: number | null; */

  @OneToMany(() => Qnas, (qna) => qna.Comments)
  Qnas: Qnas;
}