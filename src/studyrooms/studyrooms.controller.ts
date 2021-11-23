import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '../entities/Users';
import { CreateStudyroomDto } from './dto/create-studyroom.dto';
import { StudyroomsService } from './studyrooms.service';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('STUDYROOMS')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/classrooms')
export class StudyroomsController {
  constructor(private studyroomsService: StudyroomsService) {}

  @ApiOperation({ summary: 'classroom studyroom 모두 가져오기' })
  @Get(':url/studyrooms')
  async getClassroomStudyrooms(@Param('url') url, @User() user: Users) {
    return this.studyroomsService.getClassroomStudyrooms(url, user.id);
  }

  @ApiOperation({ summary: 'classroom 특정 studyroom 가져오기' })
  @Get(':url/studyrooms/:name')
  async getClassroomStudyroom(@Param('url') url, @Param('name') name) {
    return this.studyroomsService.getClassroomStudyroom(url, name);
  }

  @ApiOperation({ summary: 'classroom studyroom 만들기' })
  @Post(':url/studyrooms')
  async createClassroomStudyrooms(
    @Param('url') url,
    @Body() body: CreateStudyroomDto,
    @User() user: Users,
  ) {
    return this.studyroomsService.createClassroomStudyrooms(
      url,
      body.name,
      user.id,
    );
  }

  @ApiOperation({ summary: 'classroom studyroom 멤버 가져오기' })
  @Get(':url/studyrooms/:name/members')
  async getClassroomStudyroomMembers(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {
    return this.studyroomsService.getClassroomStudyroomMembers(url, name);
  }

  @ApiOperation({ summary: 'classroom studyroom 멤버 초대하기' })
  @Post(':url/studyrooms/:name/members')
  async createClassroomMembers(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('email') email,
  ) {
    return this.studyroomsService.createClassroomStudyroomMembers(url, name, email);
  }

  @ApiOperation({ summary: 'classroom 특정 studyroom 채팅 모두 가져오기' })
  @Get(':url/studyrooms/:name/chats')
  async getClassroomStudyroomChats(
    @Param('url') url,
    @Param('name') name,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.studyroomsService.getClassroomStudyroomChats(
      url,
      name,
      perPage,
      page,
    );
  }

  @ApiOperation({ summary: 'classroom 특정 studyroom 채팅 생성하기' })
  @Post(':url/studyrooms/:name/chats')
  async createClassroomStudyroomChats(
    @Param('url') url,
    @Param('name') name,
    @Body('content') content,
    @User() user: Users,
  ) {
    return this.studyroomsService.createClassroomStudyroomChats(
      url,
      name,
      content,
      user.id,
    );
  }

  @ApiOperation({ summary: 'Classroom 특정 Studyroom 이미지 업로드하기' })
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post(':url/studyrooms/:name/images')
  async createClassroomStudyroomImages(
    @Param('url') url,
    @Param('name') name,
    @UploadedFiles() files: Express.Multer.File[],
    @User() user: Users,
  ) {
    return this.studyroomsService.createClassroomStudyroomImages(
      url,
      name,
      files,
      user.id,
    );
  }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':url/studyroom/:name/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('name') name,
    @Query('after', ParseIntPipe) after: number,
  ) {
    return this.studyroomsService.getStudyroomUnreadsCount(url, name, after);
  }
}