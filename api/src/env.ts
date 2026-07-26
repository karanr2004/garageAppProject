import * as dotenv from 'dotenv';
import * as path from 'path';
import { controllers, entities } from './api/registry';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const toBool = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value === 'true' || value === '1';
};

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  app: {
    name: process.env.APP_NAME || 'GarageAPI',
    host: process.env.APP_HOST || '0.0.0.0',
    port: toNumber(process.env.APP_PORT, 3000),
    banner: toBool(process.env.APP_BANNER, true),
    dirs: {
      controllers,
      entities,
    },
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
    output: process.env.LOG_OUTPUT || 'dev',
  },
  db: {
    type: (process.env.TYPEORM_CONNECTION || 'mysql') as 'mysql' | 'sqlite',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: toNumber(process.env.TYPEORM_PORT, 3306),
    username: process.env.TYPEORM_USERNAME || 'root',
    password: process.env.TYPEORM_PASSWORD || 'root',
    database: process.env.TYPEORM_DATABASE || 'garage_db',
    synchronize: toBool(process.env.TYPEORM_SYNCHRONIZE, true),
    logging: toBool(process.env.TYPEORM_LOGGING, false),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  monitor: {
    route: process.env.MONITOR_ROUTE || '/status',
  },
  auth: {
    username: process.env.AUTH_USERNAME || 'admin',
    password: process.env.AUTH_PASSWORD || '1234',
    jwtSecret: process.env.AUTH_JWT_SECRET || 'garage-secret',
    expiresIn: process.env.AUTH_JWT_EXPIRES_IN || '1h',
  },
};
