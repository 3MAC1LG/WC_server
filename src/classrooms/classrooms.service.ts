import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classrooms)
    private classroomsRepository: Repository<Classrooms>,
  ) {}

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
    userId: number,
    category: string,
  ) {
    if (!title && !desc && !userId && !category) {
      throw new HttpException('데이터 형식에 맞춰 보내주세요', 401);
    }
    try {
      const user = await getManager()
        .getRepository(Users)
        .createQueryBuilder('user')
        .where('user.id = :id', { id: userId })
        .getOne();

      if (!user) {
        throw new HttpException('유저가 존재하지 않습니다', 401);
      }

      const classroom = await getManager().create(Classrooms, {
        name: title,
        desc,
        category,
        OwnerId: user.id,
      });

      if (!classroom) {
        throw new HttpException('classroom 생성에 실패했습니다', 401);
      }
      await getManager().getRepository(Classrooms).save(classroom);
      return classroom;
    } catch (e) {}
  }

  async getClassroomById(id: number) {
    if (!id) {
      throw new HttpException('파람 값이 존재하지 않습니다', 403);
    }

    try {
      const classroom = await getManager()
        .getRepository(Classrooms)
        .createQueryBuilder('classroom')
        .leftJoinAndSelect('classroom.Owner', 'users')
        .where('classroom.id = :id', { id })
        .getOne();
      if (!classroom) {
        throw new HttpException('클래스룸을 불러오지 못했습니다', 401);
      }
      return classroom;
    } catch (e) {
      console.error(e);
    }
  }

  async getClassroomByQuery(category: string, page: number) {
    if (!category && !page) {
      throw new HttpException('쿼리 값이 존재하지 않습니다', 403);
    }
    try {
      if (category === 'all') {
        const classroom = await this.classroomsRepository.findAndCount({
          select: ['id', 'name', 'desc', 'category', 'classroomImg'],
          take: 8,
          skip: (page - 1) * 8,
          order: { createdAt: 'DESC' },
        });

        if (!classroom) {
          throw new HttpException('클래스룸을 불러오지 못했습니다', 401);
        }

        return classroom;
      } else {
        const classroom = await this.classroomsRepository.findAndCount({
          where: { category },
          select: ['id', 'name', 'desc', 'category', 'classroomImg'],
          take: 8,
          skip: (page - 1) * 8,
          order: { createdAt: 'DESC' },
        });

        if (!classroom) {
          throw new HttpException('클래스룸을 불러오지 못했습니다', 401);
        }

        return classroom;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async createClassroomThumb(filePath: string, classroomId: number) {
    if (!filePath && !classroomId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const classroom = await getManager()
        .getRepository(Classrooms)
        .createQueryBuilder('classroom')
        .where('classroom.id = :id', { id: classroomId })
        .getOne();
      if (!classroom) {
        throw new HttpException('클래스룸을 불러오지 못했습니다', 401);
      }
      await getManager()
        .createQueryBuilder()
        .update(Classrooms)
        .set({ classroomImg: filePath })
        .where('id = :id', { id: classroomId })
        .execute();
      return true;
    } catch (e) {
      console.error(e);
    }
  }
}
