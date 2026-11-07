import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ quiet: true });

const required = (name) => z.string({ error: `${name} is required` }).min(1, `${name} is required`);

const secret = (name) => required(name).min(32, `${name} must be at least 32 characters`);

const duration = (name) =>
  required(name).regex(/^\d+[smhd]$/, `${name} must look like 15m, 12h or 7d`);

const isExactOrigin = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.origin === value;
  } catch {
    return false;
  }
};

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    CORS_ORIGINS: z
      .string()
      .default('')
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean),
      )
      .refine((origins) => origins.every(isExactOrigin), {
        error:
          'CORS_ORIGINS must be a comma-separated list of origins like https://app.example.com',
      }),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    DB_HOST: z.string().min(1).default('127.0.0.1'),
    DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
    DB_USER: required('DB_USER'),
    DB_PASSWORD: z.string().default(''),
    DB_NAME: required('DB_NAME'),
    DB_NAME_TEST: z
      .string()
      .regex(/_test$/, 'DB_NAME_TEST must end with _test')
      .default('central_auth_test'),
    JWT_ACCESS_SECRET: secret('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: secret('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: duration('JWT_ACCESS_EXPIRES_IN'),
    JWT_REFRESH_EXPIRES_IN: duration('JWT_REFRESH_EXPIRES_IN'),
  })
  .refine((values) => values.JWT_ACCESS_SECRET !== values.JWT_REFRESH_SECRET, {
    path: ['JWT_REFRESH_SECRET'],
    error: 'JWT_REFRESH_SECRET must be different from JWT_ACCESS_SECRET',
  });

export function parseEnv(source) {
  const result = envSchema.safeParse(source);
  if (result.success) return result.data;

  // Issues name the variable and the rule, never the value.
  const details = result.error.issues
    .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parseEnv(process.env);
