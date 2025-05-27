import { ObjectType, Field, DateScalarMode } from '@nestjs/graphql';

@ObjectType()
export class SearchHistoryEntry {
  @Field()
  query: string;

  @Field()
  timestamp: string;
}