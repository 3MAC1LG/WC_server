import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Response,
  Request,
  HttpException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import fs from 'fs';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '../entities/Users';
import { StudyroomsService } from './studyrooms.service';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('Studyrooms')
@ApiCookieAuth('connect.sid')
@Controller('/api/studyrooms')
export class StudyroomsController {
  constructor(private studyroomsService: StudyroomsService) {}

  @ApiOperation({ summary: '클래스룸에 속한 스터디룸 조회' })
  @Get('/:classroomId')
  async getStudyrooms(@Param('classroomId') classroomId, @Response() res) {
    const result = await this.studyroomsService.getStudyroom(
      parseInt(classroomId.slice(1)),
    );
    if (!result) {
      throw new HttpException('데이터 베이스 조회에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '클래스룸 에 속한스터디룸 조회에 성공했습니다',
      data: result,
    });
  }

  @ApiOperation({ summary: '스터디룸 멤버 조회' })
  @Get('/:studyroomId/members')
  async getStudyroomMembers(
    @Param('studyroomId') studyroomId,
    @Response() res,
  ) {
    const result = await this.studyroomsService.getStudyroomMember(
      parseInt(studyroomId.slice(1)),
    );
    if (!result) {
      throw new HttpException('데이터 베이스 조회에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '스터디룸 멤버 조회에 성공했습니다',
      data: result,
    });
  }

  @ApiOperation({ summary: '스터디룸 멤버 조회' })
  @Get('/:studyroomId/studyroom')
  async getStudyroomById(@Param('studyroomId') studyroomId, @Response() res) {
    const result = await this.studyroomsService.getStudyroomById(
      parseInt(studyroomId.slice(1)),
    );
    if (!result) {
      throw new HttpException('데이터 베이스 조회에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '스터디룸 멤버 조회에 성공했습니다',
      data: result,
    });
  }

  @ApiOperation({ summary: '스터디룸 생성' })
  @Post('/:classroomId')
  async createStudyrooms(
    @Param('classroomId') classroomId,
    @User() user,
    @Response() res,
    @Request() req,
  ) {
    const { studyroom, video } = req.body;
    const { id: videoId } = video;
    const { name, password } = studyroom;
    const result = await this.studyroomsService.createStudyroom(
      parseInt(classroomId.slice(1)),
      videoId,
      user.id,
      name,
      password,
    );
    if (!result) {
      throw new HttpException('데이터 베이스 저장에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '스터디룸 생성에 성공했습니다',
      data: result,
    });
  }

  @ApiOperation({ summary: '스터디룸 참여' })
  @Post('/:studyroomId/join')
  async joinStudyroom(
    @Param('studyroomId') studyroomId,
    @User() user,
    @Response() res,
  ) {
    const result = await this.studyroomsService.joinStudyroom(
      parseInt(studyroomId.slice(1)),
      user.id,
    );
    console.log(studyroomId);

    if (!result) {
      throw new HttpException('데이터 베이스 저장에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '스터디룸 참가에 성공했습니다',
      data: result,
    });
  }

  @ApiOperation({ summary: '스터디룸 삭제' })
  @Post('/:studyroom/remove')
  async removeStudyroom() {
    return null;
  }

  @ApiOperation({ summary: '스터디룸 특정 채널 채팅 모두 가져오기' })
  @Get(':studyroomId/chats')
  async getWorkspaceChannelChats(
    @Param('studyroomId') studyroomId,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.studyroomsService.getStudyroomChats(
      parseInt(studyroomId.slice(1)),
      perPage,
      page,
    );
  }

  @ApiOperation({ summary: '스터디룸 특정 채널 채팅 생성하기' })
  @Post('/:studyroomId/chats')
  async createWorkspaceChannelChats(
    @Param('studyroomId') studyroomId,
    @Body('content') content,
    @User() user,
  ) {
    return this.studyroomsService.createStudyroomChats(
      parseInt(studyroomId.slice(1)),
      content,
      user.id,
    );
  }
}
