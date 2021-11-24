import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(ClassroomMembers)
    private connection: Connection,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async join(email: string, nickname: string, password: string) {
    const exist = await this.usersRepository.findOne({ where: { email } });

    if (exist) {
      throw new HttpException('이미 존재하는 이메일입니다', 401);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });

    if (user) {
      return true;
    }

    return null;
  }

  async createUserThumb(path: string, id: number) {
    try {
      const user = await getManager()
        .createQueryBuilder()
        .update(Users)
        .set({ profileImg: path })
        .where('id = :id', { id })
        .execute();

      if (!user) {
        throw new HttpException('프로필 이미지 저장에 실패했습니다', 401);
      }

      return path;
    } catch (e) {
      console.error(e);
    }
  }

  async editUserNickname(nickname: string, id: number) {
    try {
      const user = await getManager()
        .createQueryBuilder()
        .update(Users)
        .set({ nickname })
        .where('id = :id', { id })
        .execute();

      if (!user) {
        throw new HttpException('프로필 수정에 실패했습니다', 401);
      }

      return nickname;
    } catch (e) {
      console.error(e);
    }
  }
}
