import knex from 'knex';
import type { Knex } from 'knex';
import { env } from './env/index.js';

export const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const db = knex(config);