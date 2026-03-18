import './load.js';
import { envSchema } from './schema.js';

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas');
  console.error(parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;