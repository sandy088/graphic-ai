import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({path: ".env.local"});

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema.ts",
  dbCredentials:{
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
//   out: "./drizzle",
});