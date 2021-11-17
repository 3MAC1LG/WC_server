import { Module } from '@nestjs/common';
import { VideoService } from './comments.service';
import { VideoController } from './comments.controller';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
