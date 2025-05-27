import { Resolver, Query, Args } from '@nestjs/graphql';
import { VideoService } from './video.service';
import { VideoEntry } from './types/entry/video.entry';

@Resolver()
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Query(() => VideoEntry)
  video(@Args('id') id: string) {
    return this.videoService.getVideoDetails(id);
  }
}