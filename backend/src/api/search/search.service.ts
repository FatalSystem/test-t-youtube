import { Injectable } from "@nestjs/common";
import { SearchHistoryRepository } from "src/database/repos/search-history.repo";
import { YoutubeService } from "src/youtube/youtube.service";
import { SearchInput } from "./types/inputs/search.input";

@Injectable()
export class SearchService {
  constructor(
    private readonly searchHistoryRepo: SearchHistoryRepository,
    private readonly youtubeService: YoutubeService
  ) {}

  async search(query: SearchInput) {
    await this.searchHistoryRepo.createSearchHistory(query.q);
    return await this.youtubeService.searchVideos(query);
  }

  async addToHistory(query: string) {
    await this.searchHistoryRepo.createSearchHistory(query);
  }

  async getSearchHistory() {
    const histories = await this.searchHistoryRepo.getAllSearchHistories();
    return histories
      .map((h) => ({
        query: h.query,
        timestamp: h.timestamp.toISOString(),
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getAnalytics() {
    const { analytics } = await this.searchHistoryRepo.getAnalytics();
    return analytics;
  }

  async clearHistory() {
    const histories = await this.searchHistoryRepo.getAllSearchHistories();
    for (const history of histories) {
      await this.searchHistoryRepo.deleteSearchHistory(history.id);
    }
  }
}
