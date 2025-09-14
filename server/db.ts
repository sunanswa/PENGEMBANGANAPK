import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Allow development without database for frontend-only work
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy';

let pool: Pool | null = null;
let db: any = null;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
  } else {
    // Mock database for frontend development
    console.log('⚠️  Running in frontend-only mode without database connection');
    db = {
      query: () => ({ rows: [] }),
      select: () => ({ from: () => ({ where: () => [] }) })
    };
  }
} catch (error) {
  console.log('⚠️  Database connection failed, running in frontend-only mode');
  db = {
    query: () => ({ rows: [] }),
    select: () => ({ from: () => ({ where: () => [] }) })
  };
}

export { pool, db };