import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';

@Injectable()
export class ClassroomsService {
  @InjectRepository(Classrooms)
  private classroomsRepository: Repository<Classrooms>;
  @InjectRepository(ClassroomMembers)
  private classroomMembersRepository: Repository<ClassroomMembers>;
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
    ownerId: number,
    category: string,
  ) {
    if (!title && !desc && !ownerId) {
      throw new HttpException('데이터 형식에 맞춰 보내주세요', 401);
    }

    const createClassroom = await getManager().create(Classrooms);
  }
}
