import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { KakaoGuard } from 'src/auth/kakao-auth.guard';

@Controller('oauth')
export class OauthController {
  @UseGuards(KakaoGuard)
  @Get('/kakao')
  async kakaoLogin(@Request() req, @Response({ passthrough: true }) res) {
    const user = req.user;
    if (!user) {
      return null;
    }
    console.log(user);

    return res.redirect('http://localhost:3000');
  }
}
