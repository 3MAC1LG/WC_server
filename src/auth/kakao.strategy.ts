import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-kakao';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { constants } from './constants';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super({
      clientID: constants.kakaoKey,
      clientSecret: '',
      callbackURL: 'http://localhost:4000/oauth/kakao',
    });
  }
  async validate(accessToken, refreshToken, profile, done): Promise<any> {
    const { id, provider, username } = profile;
    let changedId = null;

    if (!profile) {
      return null;
    }

    if (typeof id !== 'string') {
      changedId = Number(id);
    } else changedId = id;

    const exist = await this.usersRepository.findOne({
      provider,
      snsId: changedId,
    });

    if (exist) {
      const { password, ...rest } = exist;
      return done(null, rest);
    }

    const user = await this.usersRepository.save({
      email:
        profile._json &&
        profile._json.kakao_account.has_email &&
        profile._json.kakao_account.email,
      nickname: username,
      password: null,
      snsId: changedId,
      provider,
    });

    const { password, ...rest } = user;

    return done(null, rest);
  }
}
