import { Options } from '@mikro-orm/core';
import * as dotenv from 'dotenv';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SearchHistory } from './src/database/entities/search-history.entity';

dotenv.config();

const config: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [SearchHistory],
  migrations: {
    path: './migrations',
    pathTs: './migrations',
  },
};

export default config;
