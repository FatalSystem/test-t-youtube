import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import config from "./config/config";
import { SearchModule } from "./api/search/search.module";
import { VideoModule } from "./api/video/video.module";
import { HealthModule } from "./health/health.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    SearchModule,
    VideoModule,
    HealthModule,
  ],
})
export class AppModule {}
