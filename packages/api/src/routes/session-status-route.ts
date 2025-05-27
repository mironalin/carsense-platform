import { Hono } from "hono";
import { getCookie } from "hono/cookie";

import type { AppBindings } from "../lib/types";

import { auth } from "../lib/auth";

export const sessionStatusRoute = new Hono<AppBindings>()
  .get("/", async (c) => {
    const logger = c.get("logger");
    logger.info("SESSION STATUS ENDPOINT HIT");

    // Get current session
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    // Get all cookies from the request
    const cookieHeader = c.req.header("cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key)
        acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Check for app_login_redirect_params specifically
    const appParamsCookie = getCookie(c, "app_login_redirect_params");
    const appParams = appParamsCookie ? JSON.parse(appParamsCookie) : null;

    return c.json({
      session: {
        exists: !!session,
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
            }
          : null,
        sessionDetails: session?.session
          ? {
              id: session.session.id,
              expiresAt: session.session.expiresAt,
            }
          : null,
      },
      cookies: {
        raw: cookieHeader,
        parsed: cookies,
        appParams,
      },
    });
  });
