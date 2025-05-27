import { Resolver, Query } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchHistoryEntry } from './types/entry/history.entry';

@Resolver()
export class HistoryResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [SearchHistoryEntry])
  history() {
    return this.searchService.getSearchHistory();
  }
}