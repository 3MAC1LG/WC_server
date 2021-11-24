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
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '../entities/Users';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async upload(
    @User() user,
    @Response() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('파일이 존재하지 않습니다.', 401);
    }

    const result = await this.usersService.createUserThumb(file.path, user.id);

    if (!result) {
      throw new HttpException('프로필 이미지 저장에 실패했습니다', 401);
    }

    return res
      .status(200)
      .json({ success: true, msg: '계정 수정을 완료했습니다', data: result });
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '계정 관리' })
  @UseGuards(LoggedInGuard)
  @Post('/edit')
  async edit(@Request() req, @User() user, @Response() res) {
    const { nickname } = req.body;
    const result = await this.usersService.editUserNickname(nickname, user.id);

    if (!result) {
      throw new HttpException('프로필 수정에 실패했습니다', 401);
    }

    return res
      .status(200)
      .json({ success: true, msg: '계정 수정을 완료했습니다', data: result });
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
