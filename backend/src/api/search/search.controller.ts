import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

interface SearchQuery {
  q: string;
  pageToken?: string;
  maxResults?: string;
}

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchVideos(@Query() query: SearchQuery) {
    return this.searchService.search(query);
  }
}
