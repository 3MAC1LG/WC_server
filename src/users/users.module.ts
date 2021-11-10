import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ChannelMembers, ClassroomMembers]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
