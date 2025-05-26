"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHistoryRepository = void 0;
const core_1 = require("@mikro-orm/core");
const search_history_entity_1 = require("../entities/search-history.entity");
const common_1 = require("@nestjs/common");
const postgresql_1 = require("@mikro-orm/postgresql");
const nestjs_1 = require("@mikro-orm/nestjs");
let SearchHistoryRepository = class SearchHistoryRepository {
    constructor(searchHistoryRepo, em) {
        this.searchHistoryRepo = searchHistoryRepo;
        this.em = em;
    }
    async createSearchHistory(query) {
        const searchHistory = this.searchHistoryRepo.create({ query });
        await this.em.persistAndFlush(searchHistory);
        return searchHistory;
    }
    async getSearchHistoryById(id) {
        return this.searchHistoryRepo.findOne({ id });
    }
    async getAllSearchHistories() {
        return this.searchHistoryRepo.findAll();
    }
    async updateSearchHistory(id, query) {
        const searchHistory = await this.searchHistoryRepo.findOne({ id });
        if (!searchHistory)
            return null;
        searchHistory.query = query;
        await this.em.flush();
        return searchHistory;
    }
    async getAnalytics() {
        const qb = this.em
            .createQueryBuilder(search_history_entity_1.SearchHistory, 'sh')
            .select(['sh.query', 'count(*) as count'])
            .groupBy('sh.query')
            .orderBy({ count: 'desc' })
            .limit(10);
        const result = await qb.execute();
        return {
            analytics: result.map((item) => ({
                query: item.query,
                count: +item.count,
            })),
        };
    }
    async deleteSearchHistory(id) {
        const searchHistory = await this.searchHistoryRepo.findOne({ id });
        if (!searchHistory)
            return false;
        await this.em.removeAndFlush(searchHistory);
        return true;
    }
};
exports.SearchHistoryRepository = SearchHistoryRepository;
exports.SearchHistoryRepository = SearchHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectRepository)(search_history_entity_1.SearchHistory)),
    __metadata("design:paramtypes", [core_1.EntityRepository,
        postgresql_1.EntityManager])
], SearchHistoryRepository);
//# sourceMappingURL=search-history.repo.js.map