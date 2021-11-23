import { Controller, Get, Post, Param, Request } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClassroomsService } from './classrooms.service';
import { classroomsData } from '../../data/classrooms';

@ApiTags('CLASSROOM')
@ApiCookieAuth('connect.sid')
@Controller('api/classrooms')
export class ClassroomsController {
  constructor(private classroomsService: ClassroomsService) {}

  @ApiOperation({ summary: '내 클래스룸 가져오기' })
  @Get('/:id')
  async getMyWClassroom(@Param('id') id: string) {
    console.log(id);
    const data = classroomsData;
    return data;
  }

  @ApiOperation({ summary: '클래스룸 만들기' })
  @Post()
  async createClassroom(@Request() req) {
    const { title, desc, ownerId, category } = req.body;
    return this.classroomsService.createClassroom(
      title,
      desc,
      ownerId,
      category,
    );
  }
}
