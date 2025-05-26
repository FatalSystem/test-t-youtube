import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YoutubeService {
  private readonly youtubeApiKey: string;
  private readonly youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.youtubeApiKey = this.configService.get<string>('youtube_api_key');
  }

  async searchVideos({
    q,
    pageToken,
    maxResults = '10',
  }: {
    q: string;
    pageToken?: string;
    maxResults?: string;
  }) {
    const params = {
      key: this.youtubeApiKey,
      q,
      part: 'snippet',
      maxResults,
      type: 'video',
      pageToken,
    };

    const response = await this.httpService.axiosRef.get(
      `${this.youtubeBaseUrl}/search`,
      { params },
    );

    const { items, pageInfo, nextPageToken, prevPageToken } = response.data;

    return {
      results: items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
      })),
      totalResults: pageInfo.totalResults,
      nextPageToken,
      prevPageToken: prevPageToken || null,
    };
  }

  async getVideoDetails(videoId: string) {
    const params = {
      key: this.youtubeApiKey,
      id: videoId,
      part: 'snippet,statistics',
    };

    const response = await this.httpService.axiosRef.get(
      `${this.youtubeBaseUrl}/videos`,
      { params },
    );

    const video = response.data.items[0];

    if (!video) return null;

    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails?.default?.url,
      publishedAt: video.snippet.publishedAt,
      viewCount: +video.statistics.viewCount || 0,
      likeCount: +video.statistics.likeCount || 0,
      commentCount: +video.statistics.commentCount || 0,
    };
  }
}
