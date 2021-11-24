import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  HttpException,
  Response,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { User } from '../decorators/user.decorator';
import { ClassroomsService } from './classrooms.service';

@ApiTags('CLASSROOM')
@ApiCookieAuth('connect.sid')
@Controller('api/classrooms')
export class ClassroomsController {
  constructor(private classroomsService: ClassroomsService) {}

  @ApiOperation({ summary: '특정 클래스룸 가져오기' })
  @Get('/:id')
  async getMyWClassroom(@Param('id') id: string, @Response() res) {
    const result = await this.classroomsService.getClassroomById(
      parseInt(id.slice(1)),
    );
    if (!result) {
      throw new HttpException('클래스룸 정보를 불러오지 못했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '클래스룸 정보를 성공적으로 불러왔습니다',
      data: result,
    });
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '클래스룸 만들기' })
  @UseGuards(LoggedInGuard)
  @Post()
  async createClassroom(@Request() req, @User() user, @Response() res) {
    const { title, desc, category } = req.body;

    const result = await this.classroomsService.createClassroom(
      title,
      desc,
      user.id,
      category,
    );

    if (!result) {
      throw new HttpException('데이터베이스 저장에 실패했습니다', 401);
    }

    return res.status(200).json({
      sccuess: true,
      msg: '클래스룸 생성에 성공했습니다',
      data: result,
    });
  }

  @Get()
  async getClassroomByQuery(
    @Query('category') category,
    @Query('page') page,
    @Response() res,
  ) {
    const result = await this.classroomsService.getClassroomByQuery(
      category,
      parseInt(page),
    );

    if (!result) {
      throw new HttpException('클래스룸 정보를 불러오지 못했습니다', 401);
    }

    return res.status(200).json({
      success: true,
      msg: '클래스룸 정보를 성공적으로 불러왔습니다',
      data: result,
    });
  }
}
