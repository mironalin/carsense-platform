import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import env from "../../env";
import * as authSchemaTables from "./schema/auth-schema";

export * from "./schema/auth-schema";
export { authSchemaTables as schema };

config({ path: ".env" });

// eslint-disable-next-line no-console
console.log(env.DATABASE_URL);

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema: authSchemaTables });
