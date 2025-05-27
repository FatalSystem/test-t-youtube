import { Resolver, Query } from "@nestjs/graphql";
import { SearchService } from "./search.service";
import { Analytics } from "./types/entry/analytics.type";

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => Analytics)
  analytics() {
    return this.searchService.getAnalytics();
  }
}
