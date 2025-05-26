"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250526150750 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250526150750 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table "search_history" ("id" serial primary key, "query" varchar(255) not null, "timestamp" timestamptz not null);`);
    }
    async down() {
        this.addSql(`drop table if exists "search_history" cascade;`);
    }
}
exports.Migration20250526150750 = Migration20250526150750;
//# sourceMappingURL=Migration20250526150750.js.map