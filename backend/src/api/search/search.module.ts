import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DatabaseModule } from 'src/database/database.module';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { HistoryController } from './history.controller';
import { AnalyticsController } from './analystics.controller';

@Module({
  imports: [DatabaseModule, YoutubeModule],
  controllers: [SearchController, HistoryController, AnalyticsController],
  providers: [SearchService],
})
export class SearchModule {}
