"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const postgresql_1 = require("@mikro-orm/postgresql");
const search_history_entity_1 = require("./src/database/entities/search-history.entity");
dotenv.config();
const config = {
    driver: postgresql_1.PostgreSqlDriver,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [search_history_entity_1.SearchHistory],
    migrations: {
        path: './migrations',
        pathTs: './migrations',
    },
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map