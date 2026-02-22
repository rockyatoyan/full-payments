import 'reflect-metadata'
import 'dotenv/config'

import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ''),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false,
  logging: false,

  entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
});
