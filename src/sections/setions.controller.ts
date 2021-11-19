import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/section/:section')
export class ChannelsController {
  @Get()
  getAllChannels() {
    return null;
  }

  @Post()
  addVideo() {
    return null;
  }

  @Get(':name')
  getSpecificChannels() {
    return null;
  }

  @Get(':name/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':name/chats')
  postChat(@Body() body) {
    return null;
  }

  @Get(':name/members')
  getAllMembers() {
    return null;
  }

  @Get(':name/members')
  getInviteMembers() {
    return null;
  }
}
