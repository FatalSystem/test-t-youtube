import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SearchInput {
  @Field()
  q: string;

  @Field({ nullable: true })
  pageToken?: string;

  @Field({ nullable: true })
  maxResults?: string;
}