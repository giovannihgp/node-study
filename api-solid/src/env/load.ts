import { config } from 'dotenv';
import path from 'node:path';

const env = process.env.NODE_ENV ?? 'development';

const envFile = 
    env === 'test'
      ? '.env.test'
      : env == 'production'
        ? '.env.production'
        : '.env';
    
    config({
        path: path.resolve(process.cwd(), envFile),
    });