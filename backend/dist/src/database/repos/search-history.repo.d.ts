import { EntityRepository } from '@mikro-orm/core';
import { SearchHistory } from '../entities/search-history.entity';
import { EntityManager } from '@mikro-orm/postgresql';
export declare class SearchHistoryRepository {
    private readonly searchHistoryRepo;
    private readonly em;
    constructor(searchHistoryRepo: EntityRepository<SearchHistory>, em: EntityManager);
    createSearchHistory(query: string): Promise<SearchHistory>;
    getSearchHistoryById(id: number): Promise<SearchHistory | null>;
    getAllSearchHistories(): Promise<SearchHistory[]>;
    updateSearchHistory(id: number, query: string): Promise<SearchHistory | null>;
    getAnalytics(): Promise<{
        analytics: {
            query: any;
            count: number;
        }[];
    }>;
    deleteSearchHistory(id: number): Promise<boolean>;
}
