import { Module } from '@nestjs/common';
import { VideoResolver } from './video.resolver';
import { VideoService } from './video.service';
import { YoutubeModule } from 'src/youtube/youtube.module';

@Module({
  imports: [YoutubeModule],
  providers: [VideoService, VideoResolver],
})
export class VideoModule {}
