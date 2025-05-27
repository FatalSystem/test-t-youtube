import { ObjectType, Field } from "@nestjs/graphql";
import { SearchHistoryEntry } from "./history.entry";

@ObjectType()
export class SearchHistory {
  @Field(() => [SearchHistoryEntry])
  history: SearchHistoryEntry[];
}
