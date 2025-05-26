import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import mikroOrmConfig from '../../mikro-orm.config';
import { SearchHistoryRepository } from './repos/search-history.repo';
import { SearchHistory } from './entities/search-history.entity';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([SearchHistory]),
  ],
  providers: [SearchHistoryRepository],
  exports: [SearchHistoryRepository],
})
export class DatabaseModule {}
