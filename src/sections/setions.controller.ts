import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/section/:section')
export class ChannelsController {
  @Get()
  getSection() {
    return null;
  }

  @Post()
  createSection() {
    return null;
  }
}
