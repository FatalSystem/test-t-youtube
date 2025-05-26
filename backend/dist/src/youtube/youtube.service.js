"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let YoutubeService = class YoutubeService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3';
        this.youtubeApiKey = this.configService.get('youtube_api_key');
    }
    async searchVideos({ q, pageToken, maxResults = '10', }) {
        const params = {
            key: this.youtubeApiKey,
            q,
            part: 'snippet',
            maxResults,
            type: 'video',
            pageToken,
        };
        const response = await this.httpService.axiosRef.get(`${this.youtubeBaseUrl}/search`, { params });
        const { items, pageInfo, nextPageToken, prevPageToken } = response.data;
        return {
            results: items.map((item) => ({
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
    async getVideoDetails(videoId) {
        const params = {
            key: this.youtubeApiKey,
            id: videoId,
            part: 'snippet,statistics',
        };
        const response = await this.httpService.axiosRef.get(`${this.youtubeBaseUrl}/videos`, { params });
        const video = response.data.items[0];
        if (!video)
            return null;
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
};
exports.YoutubeService = YoutubeService;
exports.YoutubeService = YoutubeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], YoutubeService);
//# sourceMappingURL=youtube.service.js.map