import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Sections';
import { Users } from '../entities/Users';
import { ChannelsService } from './setions.service';
import { ChannelsController } from './setions.controller';
import { EventsModule } from '../events/events.module';
import { Classrooms } from 'src/entities/Classrooms';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels,
      ChannelChats,
      Users,
      Classrooms,
      ChannelMembers,
    ]),
    EventsModule,
  ],
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}