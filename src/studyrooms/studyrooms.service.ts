import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, MoreThan, Repository } from 'typeorm';
import { StudyroomMembers } from '../entities/StudyroomMembers';
import { Studyrooms } from '../entities/Studyrooms';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';
import { EventsGateway } from '../events/events.gateway';
import { Chats } from '../entities/Chats';
import { Videos } from 'src/entities/Videos';

@Injectable()
export class StudyroomsService {
  constructor(
    @InjectRepository(Studyrooms)
    private studyroomsRepository: Repository<Studyrooms>,
    @InjectRepository(StudyroomMembers)
    private studyroomMembersRepository: Repository<StudyroomMembers>,
    @InjectRepository(Classrooms)
    private classroomsRepository: Repository<Classrooms>,
    @InjectRepository(Chats)
    private ChatsRepository: Repository<Chats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async getStudyroom(classroomId: number) {
    if (!classroomId) {
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
      const publicStudyrooms = await getManager()
        .getRepository(Studyrooms)
        .find({
          where: { ClassroomId: classroom.id, private: false },
          join: {
            alias: 'studyroom',
            leftJoinAndSelect: {
              StudyroomMembers: 'studyroom.StudyroomMembers',
              Videos: 'studyroom.Video',
              Users: 'studyroom.Owner',
            },
          },
        });

      const privateStudyrooms = await getManager()
        .getRepository(Studyrooms)
        .find({ ClassroomId: classroom.id, private: true });
      return { public: publicStudyrooms, private: privateStudyrooms };
    } catch (e) {
      console.error(e);
    }
  }

  async createStudyroom(
    classroomId: number,
    videoId: number,
    userId: number,
    name: string,
    password: string | null,
  ) {
    if (!classroomId && !videoId && !userId && !name && !password) {
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
      const video = await getManager()
        .getRepository(Videos)
        .createQueryBuilder('video')
        .where('video.id = :id', { id: videoId })
        .getOne();
      if (!video) {
        throw new HttpException('비디오가 존재하지 않습니다', 401);
      }
      if (password) {
        const privateStudyroom = await getManager()
          .getRepository(Studyrooms)
          .create({
            title: name,
            password: password,
            private: true,
            OwnerId: userId,
            ClassroomId: classroom.id,
            VideoId: video.id,
          });
        const returnedStudyroom = await getManager()
          .getRepository(Studyrooms)
          .save(privateStudyroom);
        const studyroomMember = await getManager()
          .getRepository(StudyroomMembers)
          .create({
            UserId: userId,
            StudyroomId: returnedStudyroom.id,
          });
        await getManager()
          .getRepository(StudyroomMembers)
          .save(studyroomMember);
        return returnedStudyroom;
      } else {
        const privateStudyroom = await getManager()
          .getRepository(Studyrooms)
          .create({
            title: name,
            private: false,
            OwnerId: userId,
            ClassroomId: classroom.id,
            VideoId: video.id,
          });
        const returnedStudyroom = await getManager()
          .getRepository(Studyrooms)
          .save(privateStudyroom);
        const studyroomMember = await getManager()
          .getRepository(StudyroomMembers)
          .create({
            UserId: userId,
            StudyroomId: returnedStudyroom.id,
          });
        await getManager()
          .getRepository(StudyroomMembers)
          .save(studyroomMember);
        return returnedStudyroom;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async joinStudyroom(studyroomId: number, userId: number) {
    if (!studyroomId && !userId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const studyroom = await getManager()
        .getRepository(Studyrooms)
        .createQueryBuilder('studyroom')
        .where('studyroom.id = :id', { id: studyroomId })
        .getOne();
      if (!studyroom) {
        throw new HttpException('스터디룸이 존재하지 않습니다', 401);
      }
      const existMember = await getManager()
        .getRepository(StudyroomMembers)
        .createQueryBuilder('studyroomMember')
        .where('studyroomMember.UserId = :id', { id: userId })
        .getOne();

      if (existMember) {
        throw new HttpException('이미 스터디룸에 참가했습니다', 401);
      }
      const member = await getManager()
        .getRepository(StudyroomMembers)
        .create({ StudyroomId: studyroomId, UserId: userId });
      await getManager().getRepository(StudyroomMembers).save(member);

      return member;
    } catch (e) {
      console.error(e);
    }
  }

  async getStudyroomMember(studyroomId: number) {
    if (!studyroomId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const studyroom = await getManager()
        .getRepository(Studyrooms)
        .createQueryBuilder('studyroom')
        .where('studyroom.id = :id', { id: studyroomId })
        .getOne();
      if (!studyroom) {
        throw new HttpException('스터디룸이 존재하지 않습니다', 401);
      }
      const studyroomMembers = await getManager()
        .getRepository(StudyroomMembers)
        .find({
          where: { StudyroomId: studyroomId },
          join: {
            alias: 'studyroomMembers',
            leftJoinAndSelect: {
              Users: 'studyroomMembers.User',
            },
          },
        });
      return studyroomMembers;
    } catch (e) {
      console.error(e);
    }
  }

  async getStudyroomById(studyroomId: number) {
    if (!studyroomId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const exist = await getManager()
        .getRepository(Studyrooms)
        .createQueryBuilder('studyroom')
        .where('studyroom.id = :id', { id: studyroomId })
        .getOne();
      if (!exist) {
        throw new HttpException('스터디룸이 존재하지 않습니다', 401);
      }
      const studyroom = await getManager()
        .getRepository(Studyrooms)
        .find({
          where: { id: studyroomId },
          join: {
            alias: 'studyroom',
            leftJoinAndSelect: {
              Videos: 'studyroom.Video',
              Classrooms: 'studyroom.Classroom',
            },
          },
        });
      return studyroom;
    } catch (e) {
      console.error(e);
    }
  }

  async getStudyroomChats(studyroomId: number, perPage: number, page: number) {
    return this.ChatsRepository.createQueryBuilder('chats')
      .innerJoin('chats.Studyroom', 'studyroom', 'studyroom.id = :id', {
        id: studyroomId,
      })
      .innerJoinAndSelect('chats.User', 'user')
      .orderBy('chats.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createStudyroomChats(
    studyroomId: number,
    content: string,
    userId: number,
  ) {
    const studyroom = await getManager()
      .getRepository(Studyrooms)
      .createQueryBuilder('studyroom')
      .where('studyroom.id = :id', { id: studyroomId })
      .getOne();

    const chats = await getManager()
      .getRepository(Chats)
      .create({ content, UserId: userId, StudyroomId: studyroom.id });
    const savedChat = await getManager().getRepository(Chats).save(chats);
    const chatWithUser = await this.ChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['User', 'Studyroom'],
    });
    this.eventsGateway.server
      .to(`/sr-${studyroom.ClassroomId}-${chatWithUser.StudyroomId}`)
      .emit('message', chatWithUser);
  }
}
