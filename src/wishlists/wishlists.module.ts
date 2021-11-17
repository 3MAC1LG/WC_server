import { Module } from '@nestjs/common';
import { VideoService } from './wishlists.service';
import { VideoController } from './wishlists.controller';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
