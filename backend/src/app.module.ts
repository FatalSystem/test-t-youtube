import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { SearchModule } from './api/search/search.module';
import { VideoModule } from './api/video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    SearchModule,
    VideoModule,
  ],
})
export class AppModule {}
