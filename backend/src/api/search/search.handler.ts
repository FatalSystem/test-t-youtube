import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchVideosQuery } from "./types/search.query";
import { SearchService } from "./search.service";

@QueryHandler(SearchVideosQuery)
export class SearchHandler implements IQueryHandler<SearchVideosQuery> {
  constructor(private readonly searchService: SearchService) {}

  async execute(query: SearchVideosQuery) {
    // First add to history and analytics
    await this.searchService.addToHistory(query.input.q);
    // Then perform the search
    return this.searchService.search(query.input);
  }
}
