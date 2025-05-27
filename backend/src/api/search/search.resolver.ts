import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchInput } from './types/inputs/search.input';
import { SearchHistoryEntry } from './types/entry/history.entry';
import { QueryBus } from '@nestjs/cqrs';
import { SearchVideosQuery } from './types/search.query';
import { SearchEntry } from './types/entry/serch.entry';

@Resolver()
export class SearchResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => SearchEntry)
  searchVideos(@Args('input') input: SearchInput) {
    return this.queryBus.execute(new SearchVideosQuery(input));
  }
}