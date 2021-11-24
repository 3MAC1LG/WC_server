import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chats } from '../entities/Chats';
import { StudyroomMembers } from '../entities/StudyroomMembers';
import { Studyrooms } from '../entities/Studyrooms';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';
import { StudyroomsService } from './studyrooms.service';
import { StudyroomsController } from './studyrooms.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Studyrooms,
      Chats,
      Users,
      Classrooms,
      StudyroomMembers,
    ]),
    EventsModule,
  ],
  providers: [StudyroomsService],
  controllers: [StudyroomsController],
})
export class ChannelsModule {}