import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';


if (!process.env.DATABASE_URL) {
  console.log("Cannot find database url")
};
export default defineConfig({
  out: './migrations',
  schema: './src/lib/superbase/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});