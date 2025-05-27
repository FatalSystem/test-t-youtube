import { ObjectType, Field, Int } from '@nestjs/graphql';
import { VideoResultEntry } from './video-result.entry';

@ObjectType()
export class SearchEntry {
  @Field(() => [VideoResultEntry])
  results: VideoResultEntry[];

  @Field(() => Int)
  totalResults: number;

  @Field({ nullable: true })
  nextPageToken?: string;

  @Field({ nullable: true })
  prevPageToken?: string;
}