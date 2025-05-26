import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class YoutubeService {
    private readonly httpService;
    private readonly configService;
    private readonly youtubeApiKey;
    private readonly youtubeBaseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    searchVideos({ q, pageToken, maxResults, }: {
        q: string;
        pageToken?: string;
        maxResults?: string;
    }): Promise<{
        results: any;
        totalResults: any;
        nextPageToken: any;
        prevPageToken: any;
    }>;
    getVideoDetails(videoId: string): Promise<{
        videoId: any;
        title: any;
        description: any;
        thumbnailUrl: any;
        publishedAt: any;
        viewCount: number;
        likeCount: number;
        commentCount: number;
    }>;
}
