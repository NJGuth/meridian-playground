import { defineConfig } from "drizzle-kit";

const databaseUrl = new URL(process.env.DATABASE_URL as string);

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port),
    database: databaseUrl.pathname.slice(1),
    user: databaseUrl.username,
    password: decodeURIComponent(databaseUrl.password),
    ssl: "require",
  },
});
