import { Pool } from "pg";

const globalForVisitorDb = globalThis as typeof globalThis & {
  visitorPool?: Pool;
};

export function getVisitorPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for visit tracking");
  }

  return (globalForVisitorDb.visitorPool ??= new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
  }));
}
