import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Classrooms, ClassroomMembers])],
  providers: [ClassroomsService],
  controllers: [ClassroomsController],
})
export class ClassroomsModule {}
