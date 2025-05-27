import { SearchInput } from "./inputs/search.input";

export class SearchVideosQuery {
  constructor(public readonly input: SearchInput) {}
}