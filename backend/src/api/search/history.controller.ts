import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly searchHistoryService: SearchService) {}
  @Get()
  getHistory() {
    return this.searchHistoryService.getSearchHistory();
  }
}
