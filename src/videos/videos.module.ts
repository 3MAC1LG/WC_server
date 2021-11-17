import { Module } from '@nestjs/common';
import { VideoService } from './videos.service';
import { VideoController } from './videos.controller';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
