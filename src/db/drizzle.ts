import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use a properly formatted dummy connection string during build time to prevent errors
const sql = neon(process.env.DATABASE_URL || 'postgresql://user:password@localhost.local/dbname');
export const db = drizzle(sql);