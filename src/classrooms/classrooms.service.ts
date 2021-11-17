import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMembers } from '../entities/StudyroomMembers';
import { Channels } from '../entities/Sections';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';

@Injectable()
export class ClassroomsService {
  @InjectRepository(Classrooms)
  private classroomsRepository: Repository<Classrooms>;
  @InjectRepository(Channels)
  private channelsRepository: Repository<Channels>;
  @InjectRepository(ClassroomMembers)
  private classroomMembersRepository: Repository<ClassroomMembers>;
  @InjectRepository(ChannelMembers)
  private channelMembersRepository: Repository<ChannelMembers>;
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

  async createClassroom(name: string, url: string, myId: number) {
    const classroom = new Classrooms();
    classroom.name = name;
    classroom.url = url;
    classroom.OwnerId = myId;
    const returned = await this.classroomsRepository.save(classroom);
    const classroomMember = new ClassroomMembers();
    classroomMember.UserId = myId;
    classroomMember.ClassroomId = returned.id;
    await this.classroomMembersRepository.save(classroomMember);
    const channel = new Channels();
    channel.name = '일반';
    channel.ClassroomId = returned.id;
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
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
    const classroomMember = new ClassroomMembers();
    classroomMember.ClassroomId = classroom.id;
    classroomMember.UserId = user.id;
    await this.classroomMembersRepository.save(classroomMember);
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = classroom.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
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