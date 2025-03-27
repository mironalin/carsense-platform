import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema/auth-schema";

import env from "../../env";

config({ path: ".env" });

// eslint-disable-next-line no-console
console.log(env.DATABASE_URL);

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
