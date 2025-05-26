import { SearchService } from './search.service';
export declare class HistoryController {
    private readonly searchHistoryService;
    constructor(searchHistoryService: SearchService);
    getHistory(): Promise<{
        history: {
            query: string;
            timestamp: Date;
        }[];
    }>;
}
