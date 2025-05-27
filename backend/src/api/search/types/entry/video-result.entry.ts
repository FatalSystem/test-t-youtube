import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class VideoResultEntry {
  @Field()
  videoId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  thumbnailUrl: string;

  @Field()
  publishedAt: string;
}