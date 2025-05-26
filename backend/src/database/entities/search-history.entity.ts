import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class SearchHistory {
  @PrimaryKey()
  id!: number;

  @Property()
  query!: string;

  @Property()
  timestamp: Date = new Date();
}
