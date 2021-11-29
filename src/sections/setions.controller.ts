import {
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { SectionService } from './setions.service';

@Controller('api/sections')
export class SectionController {
  constructor(private sectionService: SectionService) {}
  @Get('/:classroomId')
  async getSections(@Param('classroomId') classroomId, @Response() res) {
    const result = await this.sectionService.getSection(
      parseInt(classroomId.slice(1)),
    );
    if (!result) {
      throw new HttpException('데이터 베이스 조회에 실패했습니다', 401);
    }
    return res.status(200).json({
      success: true,
      msg: '섹션을 성공적으로 불러왔습니다',
      data: result,
    });
  }

  @Post('/:classroomId')
  async createSection(
    @Param('classroomId') classroomId,
    @Request() req,
    @Response() res,
  ) {
    const { title } = req.body;
    const result = await this.sectionService.createSection(
      parseInt(classroomId.slice(1)),
      title,
    );
    if (!result) {
      throw new HttpException('데이터 베이스 저장에 실패했습니다', 401);
    }
    return res.status(200).json(result);
  }
}
