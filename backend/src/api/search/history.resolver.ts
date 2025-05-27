import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { SearchService } from "./search.service";
import { SearchHistoryEntry } from "./types/entry/history.entry";
import { SearchHistory } from "./types/entry/search-history.type";

@Resolver()
export class HistoryResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchHistory)
  async history() {
    const history = await this.searchService.getSearchHistory();
    return { history };
  }

  @Mutation(() => Boolean)
  async addToHistory(@Args("query") query: string, @Args("resultsCount") resultsCount: number) {
    await this.searchService.addToHistory(query);
    return true;
  }

  @Mutation(() => Boolean)
  async clearHistory() {
    await this.searchService.clearHistory();
    return true;
  }
}
