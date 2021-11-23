import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';
import { StudyroomMembers } from 'src/entities/StudyroomMembers';
import { Studyrooms } from 'src/entities/Studyrooms';

@Injectable()
export class ClassroomsService {
  @InjectRepository(Classrooms)
  private classroomsRepository: Repository<Classrooms>;
  @InjectRepository(ClassroomMembers)
  private classroomMembersRepository: Repository<ClassroomMembers>;
  @InjectRepository(Users)
  private usersRepository: Repository<Users>;
  @InjectRepository(Studyrooms)
  private studyroomMembersRepository: Repository<Studyrooms>;
  @InjectRepository(StudyroomMembers)
  private studyroomsRepository: Repository<StudyroomMembers>;

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
    name: string,
    desc: string,
    OwnerId: number,
    sections: number,
  ) {
    if (!name && !desc && !OwnerId) {
      throw new HttpException('데이터 형식에 맞춰 보내주세요', 401);
    }
    const classroom = new Classrooms();
    classroom.name = name;
    classroom.desc = desc;
    classroom.OwnerId = OwnerId;
    classroom.sections = sections;
    const returned = await this.classroomsRepository.save(classroom);
    const classroomMember = new ClassroomMembers();
    classroomMember.UserId = OwnerId;
    classroomMember.ClassroomId = returned.id;
    await this.classroomMembersRepository.save(classroomMember);
    const studyroom = new Studyrooms();
    studyroom.title = '일반';
    studyroom.ClassroomId = returned.id;
    const studyroomReturned = await this.studyroomsRepository.save(studyroom);
    const studyroomMember = new StudyroomMembers();
    studyroomMember.UserId = OwnerId;
    studyroomMember.StudyroomId = studyroomReturned.id;
    await this.studyroomMembersRepository.save(studyroomMember);

    // const createClassroom = await getManager().create(Classrooms);
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
          studyrooms: 'classroom.Studyrooms',
        },
      },
    });
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const classroomMember = new ClassroomMembers();
    classroomMember.ClassroomId = classroom.id;
    classroomMember.UserId = user.id;
    await this.classroomMembersRepository.save(classroomMember);
    const studyroomMember = new StudyroomMembers();
    studyroomMember.StudyroomId = classroom.Studyrooms.find(
      (v) => v.title === '일반',
    ).id;
    studyroomMember.UserId = user.id;
    await this.studyroomMembersRepository.save(studyroomMember);
  }

  async getClassroomMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Classrooms', 'classrooms', 'classrooms.url = :url', {
        url,
      })
      .getOne();
  }
}