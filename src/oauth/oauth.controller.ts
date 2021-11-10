import { Controller, Get, Request, Response } from '@nestjs/common';

@Controller('oauth')
export class OauthController {
  @Get('/kakao')
  async kakaoLogin(@Request() req, @Response({ passthrough: true }) res) {
    const user = req.user;
    if (!user) {
      return null;
    }

    return res.redirect('http://localhost:3000/main');
  }
}
