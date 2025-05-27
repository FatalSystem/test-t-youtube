import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsEntry {
  @Field()
  query: string;

  @Field(() => Int)
  count: number;
}