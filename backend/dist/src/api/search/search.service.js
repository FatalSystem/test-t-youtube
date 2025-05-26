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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const search_history_repo_1 = require("../../database/repos/search-history.repo");
const youtube_service_1 = require("../../youtube/youtube.service");
let SearchService = class SearchService {
    constructor(searchHistoryRepo, youtubeService) {
        this.searchHistoryRepo = searchHistoryRepo;
        this.youtubeService = youtubeService;
    }
    async search(query) {
        await this.searchHistoryRepo.createSearchHistory(query.q);
        return await this.youtubeService.searchVideos(query);
    }
    async getSearchHistory() {
        const histories = await this.searchHistoryRepo.getAllSearchHistories();
        return {
            history: histories.map((h) => ({
                query: h.query,
                timestamp: h.timestamp,
            })),
        };
    }
    async getAnalytics() {
        const histories = await this.searchHistoryRepo.getAllSearchHistories();
        const frequencyMap = new Map();
        for (const entry of histories) {
            frequencyMap.set(entry.query, (frequencyMap.get(entry.query) || 0) + 1);
        }
        const analytics = [...frequencyMap.entries()].map(([query, count]) => ({
            query,
            count,
        }));
        return { analytics };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [search_history_repo_1.SearchHistoryRepository,
        youtube_service_1.YoutubeService])
], SearchService);
//# sourceMappingURL=search.service.js.map