import {
  Controller,
  Get,
  HttpException,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { KakaoGuard } from 'src/auth/kakao-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('oauth')
export class OauthController {
  // @UseGuards(LocalAuthGuard)
  @UseGuards(KakaoGuard)
  @Get('/kakao')
  async kakaoLogin(@Request() req, @Response({ passthrough: true }) res) {
    const user = req;
    if (!user) {
      throw new HttpException('카카오톡 로그인에 실패했습니다', 401);
    }

    return res.redirect('http://localhost:3000');
  }
}
