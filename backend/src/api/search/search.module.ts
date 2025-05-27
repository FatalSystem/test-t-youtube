import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { DatabaseModule } from 'src/database/database.module';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { AnalyticsResolver } from './analystics.resolver';
import { HistoryResolver } from './history.resolver';
import { SearchResolver } from './search.resolver';
import { SearchHandler } from './search.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DatabaseModule, YoutubeModule],
  providers: [SearchResolver, HistoryResolver, AnalyticsResolver, SearchService, SearchHandler],
})
export class SearchModule {}
