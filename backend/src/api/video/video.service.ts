import { Injectable } from '@nestjs/common';
import { YoutubeService } from 'src/youtube/youtube.service';

@Injectable()
export class VideoService {
  constructor(private readonly youtubeService: YoutubeService) {}

  async getVideoDetails(videoId: string) {
    return this.youtubeService.getVideoDetails(videoId);
  }
}
