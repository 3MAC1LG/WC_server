import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { onlineMap } from 'src/events/onlineMap';
import { MoreThan, Repository } from 'typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { Classrooms } from '../entities/Classrooms';
import { EventsGateway } from '../events/events.gateway';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

@Injectable()
export class DMsService {
  constructor(
    @InjectRepository(Classrooms)
    private classroomsRepository: Repository<Classrooms>,
    @InjectRepository(DMs) private dmsRepository: Repository<DMs>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async getClassroomDMs(url: string, myId: number) {
    return (
      this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.dms', 'dms', 'dms.senderId = :myId', { myId })
        .leftJoin('dms', 'classroom', 'classroom.url = :url', { url })
        // .groupBy('dms.senderId')
        .getMany()
    );
  }

  async getClassroomDMChats(
    url: string,
    id: number,
    myId: number,
    perPage: number,
    page: number,
  ) {
    return this.dmsRepository
      .createQueryBuilder('dms')
      .innerJoinAndSelect('dms.Sender', 'sender')
      .innerJoinAndSelect('dms.Receiver', 'receiver')
      .innerJoin('dms.Classroom', 'classroom')
      .where('classroom.url = :url', { url })
      .andWhere(
        '((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))',
        { id, myId },
      )
      .orderBy('dms.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createClassroomDMChats(
    url: string,
    content: string,
    id: number,
    myId: number,
  ) {
    const classroom = await this.classroomsRepository.findOne({
      where: { url },
    });
    const dm = new DMs();
    dm.SenderId = myId;
    dm.ReceiverId = id;
    dm.content = content;
    dm.ClassroomId = classroom.id;
    const savedDm = await this.dmsRepository.save(dm);
    const dmWithSender = await this.dmsRepository.findOne({
      where: { id: savedDm.id },
      relations: ['Sender'],
    });
    const receiverSocketId = getKeyByValue(
      onlineMap[`/ws-${classroom.url}`],
      Number(id),
    );
    this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
  }

  async createClassroomDMImages(
    url: string,
    files: Express.Multer.File[],
    id: number,
    myId: number,
  ) {
    const classroom = await this.classroomsRepository.findOne({
      where: { url },
    });
    for (let i = 0; i < files.length; i++) {
      const dm = new DMs();
      dm.SenderId = myId;
      dm.ReceiverId = id;
      dm.content = files[i].path;
      dm.ClassroomId = classroom.id;
      const savedDm = await this.dmsRepository.save(dm);
      const dmWithSender = await this.dmsRepository.findOne({
        where: { id: savedDm.id },
        relations: ['Sender'],
      });
      const receiverSocketId = getKeyByValue(
        onlineMap[`/ws-${classroom.url}`],
        Number(id),
      );
      this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
    }
  }

  async getDMUnreadsCount(url, id, myId, after) {
    const classroom = await this.classroomsRepository.findOne({
      where: { url },
    });
    return this.dmsRepository.count({
      where: {
        ClassroomId: classroom.id,
        SenderId: id,
        ReceiverId: myId,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }
}