import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Classrooms)
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getClassroomChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
        name,
      })
      .innerJoin('channels.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .getMany();
  }
}
