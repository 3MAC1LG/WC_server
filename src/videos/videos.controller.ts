import {
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { VideoService } from './videos.service';

@Controller('/api/videos')
export class VideoController {
  constructor(private videoService: VideoService) {}
  @Post()
  async registerVideo(@Request() req, @Response() res) {
    const { title, videoUrl, sectionId } = req.body;
    const result = await this.videoService.registerVideo(
      title,
      videoUrl,
      sectionId,
    );
    if (!result) {
      throw new HttpException('데이터 베이스 저장에 실패했습니다', 401);
    }
    return res.status(200).json(result);
  }

  @Get('/:sectionId')
  async getVideoBySectionId(@Param('sectionId') sectionId, @Response() res) {
    const result = await this.videoService.getVideoBySectionID(
      parseInt(sectionId.slice(1)),
    );
    if (!result) {
      throw new HttpException('데이터 베이스 저장에 실패했습니다', 401);
    }
    return res.status(200).json(result);
  }

  @Get('/:sutdyroomId/studyroom')
  async getStudyroomVideo(@Param('studyroomId') studyroomId, @Response() res) {
    const result = null;
    return null;
  }
}
