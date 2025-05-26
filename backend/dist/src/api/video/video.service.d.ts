import { YoutubeService } from 'src/youtube/youtube.service';
export declare class VideoService {
    private readonly youtubeService;
    constructor(youtubeService: YoutubeService);
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
