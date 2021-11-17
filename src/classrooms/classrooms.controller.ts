import {
    Controller,
    Get,
    UseGuards,
    Post,
    Body,
    Param,
    ParseIntPipe,
  } from '@nestjs/common';
  import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { LoggedInGuard } from '../auth/logged-in.guard';
  import { User } from '../decorators/user.decorator';
  import { Users } from '../entities/Users';
  import { CreateClassroomDto } from './dto/create-classroom.dto';
  import { ClassroomsService } from './classrooms.service';
  
  @ApiTags('CLASSROOM')
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Controller('api/classroom')
  export class ClassroomsController {
    constructor(private classroomsService: ClassroomsService) {}
  
    @ApiOperation({ summary: '내 클래스룸 가져오기' })
    @Get()
    async getMyWClassroom(@User() user: Users) {
      return this.classroomsService.findMyClassrooms(user.id);
    }
  
    @ApiOperation({ summary: '클래스룸 만들기' })
    @Post()
    async createClassroom(@User() user: Users, @Body() body: CreateClassroomDto) {
      return this.classroomsService.createClassroom(
        body.classroom,
        body.url,
        user.id,
      );
    }
  
    @ApiOperation({ summary: 'Classroom 멤버 가져오기' })
    @Get(':url/members')
    async getClassroomMembers(@Param('url') url: string) {
      return this.classroomsService.getClassroomMembers(url);
    }
  
    @ApiOperation({ summary: 'Classroom 멤버 초대하기' })
    @Post(':url/members')
    async createClassroomMembers(
      @Param('url') url: string,
      @Body('email') email,
    ) {
      return this.classroomsService.createClassroomMembers(url, email);
    }
  
    @ApiOperation({ summary: 'Classroom 특정멤버 가져오기' })
    @Get(':url/members/:id')
    async getClassroomMember(
      @Param('url') url: string,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.classroomsService.getClassroomMember(url, id);
    }
  
    @ApiOperation({ summary: '클래스룸 특정멤버 가져오기' })
    @Get(':url/users/:id')
    async getClassroomUser(
      @Param('url') url: string,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.classroomsService.getClassroomMember(url, id);
    }
  }