import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';
import { DMsController } from './dms.controller';
import { DMsService } from './dms.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([DMs, Users, Classrooms]), EventsModule],
  controllers: [DMsController],
  providers: [DMsService],
})
export class DMsModule {}