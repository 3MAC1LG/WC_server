import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';

@Injectable()
export class ClassroomsService {
  @InjectRepository(Classrooms)
  private classroomsRepository: Repository<Classrooms>;
  @InjectRepository(ClassroomMembers)
  @InjectRepository(Users)
  private usersRepository: Repository<Users>;

  async findById(id: number) {
    return this.classroomsRepository.findOne({ where: { id } });
  }

  async findMyClassrooms(myId: number) {
    return this.classroomsRepository.find({
      where: {
        ClassroomMembers: [{ userId: myId }],
      },
    });
  }

  async createClassroom(
    title: string,
    desc: string,
    section: string[],
    ownerId: number,
  ) {
    if (!title && !desc && !section && !ownerId) {
      throw new HttpException('데이터 형식에 맞춰 보내주세요', 401);
    }
  }

  async getClassroomMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.ClassroomMembers', 'members')
      .innerJoin('members.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .getMany();
  }

  async createClassroomMembers(url, email) {
    const classroom = await this.classroomsRepository.findOne({
      where: { url },
      join: {
        alias: 'classroom',
        innerJoinAndSelect: {
          channels: 'classroom.Channels',
        },
      },
    });
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
  }

  async getClassroomMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.classrooms', 'classrooms', 'classrooms.url = :url', {
        url,
      })
      .getOne();
  }
}
