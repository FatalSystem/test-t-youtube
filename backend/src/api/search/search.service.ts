import { Injectable } from '@nestjs/common';
import { SearchQuery } from './types/search.query';
import { SearchHistoryRepository } from 'src/database/repos/search-history.repo';
import { YoutubeService } from 'src/youtube/youtube.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly searchHistoryRepo: SearchHistoryRepository,
    private readonly youtubeService: YoutubeService,
  ) {}

  async search(query: SearchQuery) {
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

    const frequencyMap = new Map<string, number>();
    for (const entry of histories) {
      frequencyMap.set(entry.query, (frequencyMap.get(entry.query) || 0) + 1);
    }

    const analytics = [...frequencyMap.entries()].map(([query, count]) => ({
      query,
      count,
    }));

    return { analytics };
  }
}
