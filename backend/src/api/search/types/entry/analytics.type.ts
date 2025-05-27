import { ObjectType, Field } from "@nestjs/graphql";
import { AnalyticsEntry } from "./analytics.entry";

@ObjectType()
export class Analytics {
  @Field(() => [AnalyticsEntry])
  analytics: AnalyticsEntry[];
}
