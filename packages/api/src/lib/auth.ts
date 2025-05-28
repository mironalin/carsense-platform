import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt } from "better-auth/plugins";
import { Buffer } from "node:buffer";
import { randomBytes, scryptSync } from "node:crypto";

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
  plugins: [jwt(), bearer()],
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
