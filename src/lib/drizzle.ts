import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.BETTER_AUTH_DB_URL!);
