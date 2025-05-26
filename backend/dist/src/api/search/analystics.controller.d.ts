import { SearchService } from './search.service';
export declare class AnalyticsController {
    private readonly searchService;
    constructor(searchService: SearchService);
    getAnalytics(): Promise<{
        analytics: {
            query: string;
            count: number;
        }[];
    }>;
}
