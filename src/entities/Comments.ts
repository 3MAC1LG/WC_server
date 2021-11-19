import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';
import { Qnas } from './Qnas';

@Entity({ schema: 'wc_server', name: 'comments' })
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

  @Column('int', { name: 'QnaId', nullable: true })
  QnaId: number | null;

  @ManyToOne(() => Qnas, (qnas) => qnas.Comments)
  @JoinColumn({ name: 'QnaId', referencedColumnName: 'id' })
  Qna: Qnas;

  @ManyToOne(() => Users, (user) => user.Comments)
  @JoinColumn({ name: 'OwnerId', referencedColumnName: 'id' })
  User: Users;
}
