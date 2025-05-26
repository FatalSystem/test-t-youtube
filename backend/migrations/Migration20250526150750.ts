import { Migration } from '@mikro-orm/migrations';

export class Migration20250526150750 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "search_history" ("id" serial primary key, "query" varchar(255) not null, "timestamp" timestamptz not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "search_history" cascade;`);
  }

}
