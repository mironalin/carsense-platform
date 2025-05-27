import type { ZodError } from "zod";

import { z } from "zod";

// Define the environment schema
const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  API_DEV_URL: z.string().default("http://localhost:3000"),
  API_PROD_URL: z.string().default("https://api.carsense.workers.dev"),
});

export type env = z.infer<typeof EnvSchema>;

// Access environment variables correctly
const rawEnv = {
  // Use appropriate Vite environment variables (only available in browser context)
  NODE_ENV: (typeof import.meta !== "undefined" && import.meta.env?.MODE) || "development",
  API_DEV_URL: (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_DEV_URL) || "http://localhost:3000",
  API_PROD_URL: (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_PROD_URL) || "https://api.carsense.workers.dev",
};

// Log environment for debugging
// console.log("Environment loaded:", rawEnv);

// eslint-disable-next-line import/no-mutable-exports
let env: env;

try {
  env = EnvSchema.parse(rawEnv);
}
catch (error) {
  const e = error as ZodError;
  console.error("Invalid env:");
  console.error(e.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export default env;
