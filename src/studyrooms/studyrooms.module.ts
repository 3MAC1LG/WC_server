import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Sections';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';
import { ClassroomsService } from './studyrooms.service';
import { ClassroomsController } from './studyrooms.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Classrooms,
      Channels,
      ClassroomMembers,
      ChannelMembers,
    ]),
  ],
  providers: [ClassroomsService],
  controllers: [ClassroomsController],
})
export class ClassroomsModule {}