import { SearchService } from './search.service';
interface SearchQuery {
    q: string;
    pageToken?: string;
    maxResults?: string;
}
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchVideos(query: SearchQuery): Promise<{
        results: any;
        totalResults: any;
        nextPageToken: any;
        prevPageToken: any;
    }>;
}
export {};
