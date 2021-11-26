import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';
import { ClassroomMembers } from 'src/entities/ClassroomMembers';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classrooms)
    private classroomsRepository: Repository<Classrooms>,
    @InjectRepository(ClassroomMembers)
    private classroomMembersRepository: Repository<ClassroomMembers>,
  ) {}

  async findById(id: number) {
    return this.classroomsRepository.findOne({ where: { id } });
  }

  async findMyClassrooms(userId: number) {
    try {
      const myClassroom = await getManager()
        .getRepository(ClassroomMembers)
        .createQueryBuilder('classroomMember')
        .leftJoinAndSelect('classroomMember.User', 'users')
        .where('classroomMember.UserId = :id', { id: userId })
        .getMany();

      if (!myClassroom) {
        throw new HttpException('클래스룸을 불러오지 못했습니다', 401);
      }
      return myClassroom;
    } catch (e) {
      console.error(e);
    }
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
        .leftJoinAndSelect('classroom.ClassroomMembers', 'classroomMembers')
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

  async register(classroomId: number, userId: number) {
    if (!classroomId && !userId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const classroom = await getManager()
        .getRepository(Classrooms)
        .createQueryBuilder('classroom')
        .where('classroom.id = :id', { id: classroomId })
        .getOne();

      if (!classroom) {
        throw new HttpException('클래스룸이 존재하지 않습니다', 401);
      }

      const myClassroom = await getManager()
        .getRepository(ClassroomMembers)
        .createQueryBuilder()
        .where('classroomid = :id', { id: classroomId })
        .andWhere('userid = :id', { id: userId })
        .getOne();

      if (myClassroom) {
        throw new HttpException('이미 수강신청한 강의입니다', 401);
      }

      const classroomMember = await getManager()
        .getRepository(ClassroomMembers)
        .create({ ClassroomId: classroomId, UserId: userId });

      await getManager().getRepository(ClassroomMembers).save(classroomMember);
      return classroomMember;
    } catch (e) {
      console.error(e);
    }
  }

  async cancle(classroomId: number, userId: number) {
    if (!classroomId && !userId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const myClassroom = await this.classroomMembersRepository.findOne({
        where: { UserId: userId, ClassroomId: classroomId },
      });

      if (!myClassroom) {
        throw new HttpException(
          '데이터베이스에 조회된 수강신청 내역이 없습니다',
          401,
        );
      }
      await this.classroomMembersRepository.remove(myClassroom);
      return { success: true, msg: '수강취소에 성공했습니다' };
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}
