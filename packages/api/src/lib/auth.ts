import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt } from "better-auth/plugins";

import env from "../../env";
import { db } from "../db";

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
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // autoSignIn: false,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000", env.ANDROID_APP_REDIRECT_URI],
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
