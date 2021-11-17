import { Module } from '@nestjs/common';
import { VideoService } from './qnas.service';
import { VideoController } from './qnas.controller';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
