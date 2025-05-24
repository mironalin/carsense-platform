import type { ZodError } from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.string().default("3000"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  ML_SERVICE_URL: z.string().default("http://localhost:8000/api/v1"),
  ML_SERVICE_JWT_SECRET: z.string().default("shared-secret-with-main-backend"),
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: env;

try {
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (error) {
  const e = error as ZodError;
  console.error("Invalid env:");
  console.error(e.flatten().fieldErrors);
  process.exit(1);
}

export default env;
