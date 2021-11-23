import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
  Get,
  Response,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '../entities/Users';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USERS')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 가져오기' })
  @Get('/')
  async getProfile(@User() user): Promise<any> {
    return user;
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: Users) {
    return user;
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('/logout')
  logout(@Response({ passthrough: true }) res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res
      .status(200)
      .json({ success: true, msg: '로그아웃에 성공했습니다' });
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '계정 관리' })
  @UseGuards(LoggedInGuard)
  @Post('/edit')
  edit(@Request() req) {
    const {} = req.body;
    return null;
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(NotLoggedInGuard)
  @Post()
  async join(@Body() data: JoinRequestDto) {
    const user = this.usersService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException();
    }
    const result = await this.usersService.join(
      data.email,
      data.nickname,
      data.password,
    );
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }
}
