import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { StudyroomMembers } from '../entities/StudyroomMembers';
import { Studyrooms } from '../entities/Studyrooms';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';
import { EventsGateway } from '../events/events.gateway';
import { Chats } from '../entities/Chats';

@Injectable()
export class StudyroomsService {
  constructor(
    @InjectRepository(Studyrooms)
    private studyroomsRepository: Repository<Studyrooms>,
    @InjectRepository(StudyroomMembers)
    private studyroomMembersRepository: Repository<StudyroomMembers>,
    @InjectRepository(Classrooms)
    private classroomsRepository: Repository<Classrooms>,
    @InjectRepository(Classrooms)
    private ChatsRepository: Repository<Chats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findById(id: number) {
    return this.studyroomsRepository.findOne({ where: { id } });
  }

  async getClassroomStudyrooms(url: string, myId: number) {
    return this.studyroomsRepository
      .createQueryBuilder('studyrooms')
      .innerJoinAndSelect(
        'studyrooms.StudyroomMembers',
        'studyroomMembers',
        'studyroomMembers.userId = :myId',
        { myId },
      )
      .innerJoinAndSelect(
        'studyrooms.Classroom',
        'classroom',
        'classroom.url = :url',
        { url },
      )
      .getMany();
  }

  async getClassroomStudyroom(url: string, title: string) {
    return this.studyroomsRepository
      .createQueryBuilder('studyroom')
      .innerJoin('studyroom.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .where('studyroom.title = :title', { title })
      .getOne();
  }

  async createClassroomStudyrooms(url: string, title: string, myId: number) {
    const classroom = await this.classroomsRepository.findOne({
      where: { url },
    });
    const studyroom = new Studyrooms();
    studyroom.title = title;
    studyroom.ClassroomId = classroom.id;
    const studyroomReturned = await this.studyroomsRepository.save(studyroom);
    const studyroomMember = new StudyroomMembers();
    studyroomMember.UserId = myId;
    studyroomMember.StudyroomId = studyroomReturned.id;
    await this.studyroomMembersRepository.save(studyroomMember);
  }

  async getClassroomStudyroomMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Studyrooms', 'studyrooms', 'studyrooms.name = :name', {
        name,
      })
      .innerJoin('studyrooms.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .getMany();
  }

  async createClassroomStudyroomMembers(url, name, email) {
    const studyroom = await this.studyroomsRepository
      .createQueryBuilder('studyroom')
      .innerJoin('studyroom.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    if (!studyroom) {
      return null; // TODO: 이 때 어떻게 에러 발생?
    }
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoin('user.Classrooms', 'classroom', 'classroom.url = :url', {
        url,
      })
      .getOne();
    if (!user) {
      return null;
    }
    const studyroomMember = new StudyroomMembers();
    studyroomMember.StudyroomId = studyroom.id;
    studyroomMember.UserId = user.id;
    await this.studyroomMembersRepository.save(studyroomMember);
  }

  async getClassroomStudyroomChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.ChatsRepository
      .createQueryBuilder('Chats')
      .innerJoin('Chats.Studyroom', 'studyroom', 'studyroom.name = :name', {
        name,
      })
      .innerJoin('studyroom.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .innerJoinAndSelect('Chats.User', 'user')
      .orderBy('Chats.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createClassroomStudyroomChats(
    url: string,
    name: string,
    content: string,
    myId: number,
  ) {
    const studyroom = await this.studyroomsRepository
      .createQueryBuilder('studyroom')
      .innerJoin('studyroom.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .where('studyroom.name = :name', { name })
      .getOne();
    const chats = new Chats();
    chats.content = content;
    chats.UserId = myId;
    chats.StudyroomId = studyroom.id;
    const savedChat = await this.ChatsRepository.save(chats);
    const chatWithUser = await this.ChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['User', 'Studyroom'],
    });
    this.eventsGateway.server
      // .of(`/ws-${url}`)
      .to(`/ws-${url}-${chatWithUser.StudyroomId}`)
      .emit('message', chatWithUser);
  }

  async createClassroomStudyroomImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    myId: number,
  ) {
    console.log(files);
    const studyroom = await this.studyroomsRepository
      .createQueryBuilder('studyroom')
      .innerJoin('studyroom.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .where('studyroom.name = :name', { name })
      .getOne();
    for (let i = 0; i < files.length; i++) {
      const chats = new Chats();
      chats.content = files[i].path;
      chats.UserId = myId;
      chats.StudyroomId = studyroom.id;
      const savedChat = await this.ChatsRepository.save(chats);
      const chatWithUser = await this.ChatsRepository.findOne({
        where: { id: savedChat.id },
        relations: ['User', 'Studyroom'],
      });
      this.eventsGateway.server
        // .of(`/ws-${url}`)
        .to(`/ws-${url}-${chatWithUser.StudyroomId}`)
        .emit('message', chatWithUser);
    }
  }

  async getStudyroomUnreadsCount(url, name, after) {
    const studyroom = await this.studyroomsRepository
      .createQueryBuilder('studyroom')
      .innerJoin('studyroom.Classroom', 'classroom', 'classroom.url = :url', {
        url,
      })
      .where('studyroom.name = :name', { name })
      .getOne();
    return this.ChatsRepository.count({
      where: {
        StudyroomId: studyroom.id,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }
}