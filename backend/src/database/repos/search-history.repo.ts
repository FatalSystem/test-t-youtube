import { EntityRepository } from '@mikro-orm/core';
import { SearchHistory } from '../entities/search-history.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class SearchHistoryRepository {
  constructor(
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepo: EntityRepository<SearchHistory>,
    private readonly em: EntityManager,
  ) {}
  async createSearchHistory(query: string): Promise<SearchHistory> {
    const searchHistory = this.searchHistoryRepo.create({ query });
    await this.em.persistAndFlush(searchHistory);
    return searchHistory;
  }

  async getSearchHistoryById(id: number): Promise<SearchHistory | null> {
    return this.searchHistoryRepo.findOne({ id });
  }

  async getAllSearchHistories(): Promise<SearchHistory[]> {
    return this.searchHistoryRepo.findAll();
  }

  async updateSearchHistory(
    id: number,
    query: string,
  ): Promise<SearchHistory | null> {
    const searchHistory = await this.searchHistoryRepo.findOne({ id });
    if (!searchHistory) return null;
    searchHistory.query = query;
    await this.em.flush();
    return searchHistory;
  }

  async getAnalytics() {
    const qb = this.em
      .createQueryBuilder(SearchHistory, 'sh')
      .select(['sh.query', 'count(*) as count'])
      .groupBy('sh.query')
      .orderBy({ count: 'desc' })
      .limit(10);

    const result = await qb.execute();

    return {
      analytics: result.map((item: any) => ({
        query: item.query,
        count: +item.count,
      })),
    };
  }

  async deleteSearchHistory(id: number): Promise<boolean> {
    const searchHistory = await this.searchHistoryRepo.findOne({ id });
    if (!searchHistory) return false;
    await this.em.removeAndFlush(searchHistory);
    return true;
  }
}
