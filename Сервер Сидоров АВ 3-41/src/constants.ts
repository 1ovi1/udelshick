import * as dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

// Database Constants
export const DB_PROVIDER = 'DbConnectionToken';
export const SERVICE = 'DB_POSTGRES_SERVICE';
export const DATABASE_SERVICE =
  process.env.DATABASE_SERVICE || 'DATABASE_SERVICE';

// Application Constants
export const APP_NAME = process.env.APP_NAME || 'clean.architecture';
export const APP_PORT = parseInt(process.env.PORT || '4000', 10);
export const APP_HOST = process.env.APP_HOST || '0.0.0.0';
export const NODE_ENV = process.env.NODE_ENV || 'development';

// PostgreSQL Constants
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://nestjs_user:nestjs_password@localhost:5432/nestjs_postgres';
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '5432', 10);

// JWT Constants
export const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret';
export const JWT_EXPIRATION_TIME = (process.env.JWT_EXPIRATION_TIME ??
  '3600s') as StringValue;
export const JWT_REFRESH_EXPIRATION_TIME = (process.env
  .JWT_REFRESH_EXPIRATION_TIME ?? '7d') as StringValue;
// Encryption Constants
if (!process.env.EMAIL_ENCRYPTION_KEY) {
  throw new Error(
    'FATAL ERROR: EMAIL_ENCRYPTION_KEY is not defined in environment variables.',
  );
}
if (!process.env.EMAIL_BLIND_INDEX_SECRET) {
  throw new Error(
    'FATAL ERROR: EMAIL_BLIND_INDEX_SECRET is not defined in environment variables.',
  );
}
export const EMAIL_ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY;
export const EMAIL_BLIND_INDEX_SECRET = process.env.EMAIL_BLIND_INDEX_SECRET;
