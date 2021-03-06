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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  async getClassroomById(@Param('id') id: string, @Response() res) {
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

  @ApiOperation({ summary: '마이 클래스룸 가져오기' })
  @UseGuards(LoggedInGuard)
  @Post('/user')
  async findMyClassrooms(@User() user, @Response() res) {
    const result = await this.classroomsService.findMyClassrooms(user.id);
    if (!result) {
      throw new HttpException('데이터베이스 조회에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '마이 클래스룸을 성공적으로 가져왔습니다',
      data: result,
    });
  }

  @ApiOperation({ summary: '카테고리별 클래스룸 가져오기' })
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

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '클래스룸 썸네일 생성' })
  @UseGuards(LoggedInGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @Post('/upload')
  async createClassroomThumb(
    @Request() req,
    @Response() res,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const { filePath, classroomId } = req.body;
    const result = await this.classroomsService.createClassroomThumb(
      filePath,
      classroomId,
    );
    if (!result) {
      throw new HttpException('클래스룸 썸네일 저장에 실패했습니다', 401);
    }
    return res
      .status(200)
      .json({ success: true, msg: '클래스룸 썸네일 생성을 성공했습니다' });
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '클래스룸 수강신청' })
  @UseGuards(LoggedInGuard)
  @Post('/:classroomId/register')
  async register(
    @User() user,
    @Response() res,
    @Param('classroomId') classroomId,
  ) {
    const result = await this.classroomsService.register(
      parseInt(classroomId.slice(1)),
      user.id,
    );
    if (!result) {
      throw new HttpException('클래스룸 수강신청에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '클래스룸 수강신청에 성공했습니다',
      data: result,
    });
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '클래스룸 수강취소' })
  @UseGuards(LoggedInGuard)
  @Post('/:classroomId/cancle')
  async cancle(
    @User() user,
    @Response() res,
    @Param('classroomId') classroomId,
  ) {
    const result = await this.classroomsService.cancle(
      parseInt(classroomId.slice(1)),
      user.id,
    );

    if (!result) {
      throw new HttpException('sql 쿼리를 실패했습니다', 401);
    }

    return res.status(200).json(result);
  }
}
