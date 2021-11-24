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
import { Comments } from './Comments';
import { Users } from './Users';
import { Videos } from './Videos';

@Entity({ schema: 'wc_server', name: 'qnas' })
export class Qnas {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 30 })
  title: string;

  @Column('varchar', { name: 'desc' })
  desc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  DeleteAt: Date;

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number | null;

  @Column('int', { name: 'VideoId', nullable: true })
  VideoId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  SenderId: number | null;

  @Column('int', { name: 'ReceiverId', nullable: true })
  ReceiverId: number | null;

  @OneToMany(() => Comments, (comments) => comments.Qna)
  Comments: Comments[];

  @ManyToOne(() => Videos, (video) => video.Qnas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'VideoId', referencedColumnName: 'id' }])
  Video: Videos;

  @ManyToOne(() => Users, (users) => users.Qnas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  Sender: Users;

  @ManyToOne(() => Users, (users) => users.Qnas2, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  Receiver: Users;
}
