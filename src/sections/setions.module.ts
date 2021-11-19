import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { SectionService } from './setions.service';
import { ChannelsController } from './setions.controller';
import { EventsModule } from '../events/events.module';
import { Classrooms } from 'src/entities/Classrooms';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Classrooms]), EventsModule],
  providers: [SectionService],
  controllers: [ChannelsController],
})
export class SectionModule {}
