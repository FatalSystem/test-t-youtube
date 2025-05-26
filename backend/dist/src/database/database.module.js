"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const mikro_orm_config_1 = require("../../mikro-orm.config");
const search_history_repo_1 = require("./repos/search-history.repo");
const search_history_entity_1 = require("./entities/search-history.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forRoot(mikro_orm_config_1.default),
            nestjs_1.MikroOrmModule.forFeature([search_history_entity_1.SearchHistory]),
        ],
        providers: [search_history_repo_1.SearchHistoryRepository],
        exports: [search_history_repo_1.SearchHistoryRepository],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map