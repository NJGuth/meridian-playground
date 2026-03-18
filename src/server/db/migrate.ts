import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Make sure .env.local is loaded.");
  process.exit(1);
}

const url = new URL(databaseUrl);
const client = postgres({
  host: url.hostname,
  port: Number(url.port),
  database: url.pathname.slice(1),
  user: url.username,
  password: decodeURIComponent(url.password),
  max: 1,
});

const db = drizzle(client);

async function run() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
  await client.end();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
