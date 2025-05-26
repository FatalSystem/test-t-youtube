import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly searchService: SearchService) {}
  @Get()
  getAnalytics() {
    return this.searchService.getAnalytics();
  }
}
