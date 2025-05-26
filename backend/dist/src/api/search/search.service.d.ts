import { SearchQuery } from './types/search.query';
import { SearchHistoryRepository } from 'src/database/repos/search-history.repo';
import { YoutubeService } from 'src/youtube/youtube.service';
export declare class SearchService {
    private readonly searchHistoryRepo;
    private readonly youtubeService;
    constructor(searchHistoryRepo: SearchHistoryRepository, youtubeService: YoutubeService);
    search(query: SearchQuery): Promise<{
        results: any;
        totalResults: any;
        nextPageToken: any;
        prevPageToken: any;
    }>;
    getSearchHistory(): Promise<{
        history: {
            query: string;
            timestamp: Date;
        }[];
    }>;
    getAnalytics(): Promise<{
        analytics: {
            query: string;
            count: number;
        }[];
    }>;
}
