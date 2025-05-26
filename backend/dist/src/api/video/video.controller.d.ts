import { VideoService } from './video.service';
export declare class VideoController {
    private readonly videoService;
    constructor(videoService: VideoService);
    findOne(id: string): Promise<{
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
