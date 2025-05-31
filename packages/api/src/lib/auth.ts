import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt, openAPI } from "better-auth/plugins";
import { Buffer } from "node:buffer";
import { randomBytes, scryptSync } from "node:crypto";
// export openAPISchema to a .json file
// import { writeFileSync } from "node:fs";
// import { dirname, join } from "node:path";
// import { fileURLToPath } from "node:url";

import env from "../../env";
import { db, schema } from "../db";

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },
  appName: "CarSense",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => {
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        return `${salt}:${hash}`;
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        const [salt, key] = hash.split(":");
        if (!salt || !key) {
          return false;
        }
        const keyBuffer = Buffer.from(key, "hex");
        const hashBuffer = scryptSync(password, salt, 64);
        return keyBuffer.equals(hashBuffer);
      },
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000", "https://api.carsense.workers.dev", env.ANDROID_APP_REDIRECT_URI],
  plugins: [jwt(), bearer(), openAPI()],
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
    },
    cookies: {
      session_token: {
        name: "carsense_session_token",
        attributes: {
          httpOnly: true,
          sameSite: "lax",
        },
      },
    },
  },
});

// const openAPISchema = await auth.api.generateOpenAPISchema();

// // Get the directory of the current module
// // ESM doesn't have __dirname, so we need to derive it
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Define the path for the openapi.json file relative to the current file
// // This will place openapi.json in the same directory as auth.ts
// const outputPath = join(__dirname, "authopenapi.json");

// try {
//   writeFileSync(outputPath, JSON.stringify(openAPISchema, null, 2));
//   console.log(`OpenAPI schema exported to ${outputPath}`);
// }
// catch (error) {
//   console.error("Failed to export OpenAPI schema:", error);
// }
