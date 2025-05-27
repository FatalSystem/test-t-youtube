import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchVideosQuery } from "./types/search.query";
import { SearchService } from "./search.service";


@QueryHandler(SearchVideosQuery)
export class SearchHandler implements IQueryHandler<SearchVideosQuery> {
  constructor(private readonly searchService: SearchService) {}

  async execute(query: SearchVideosQuery) {
    return this.searchService.search(query.input);
  }
}