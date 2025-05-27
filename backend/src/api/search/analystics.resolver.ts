import { Resolver, Query } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { AnalyticsEntry } from './types/entry/analytics.entry';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [AnalyticsEntry])
  analytics() {
    return this.searchService.getAnalytics();
  }
}