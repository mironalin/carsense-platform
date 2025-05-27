import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import type { AppBindings } from "@/lib/types";

import env from "../../env";
import { auth } from "../lib/auth";

// Helper to create a bearer token
async function createBearerToken(session: any) {
  // Use session token if available (better-auth stores the token in the session)
  if (session.session?.token) {
    return session.session.token;
  }

  // Fallback to user ID if no token is available
  if (session.user?.id) {
    return `user_${session.user.id}`;
  }

  return null;
}

export const androidAuthRoute = new Hono<AppBindings>()
  .get("/", async (c) => {
    const logger = c.get("logger");
    logger.info({ method: c.req.method, url: c.req.url }, "ANDROID AUTH ROUTE HIT");

    // Get current session
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    // Enhanced logging - print detailed session information
    logger.info("========== ANDROID AUTH SESSION DETAILS ==========");
    logger.info({ sessionExists: !!session }, "Session check");
    if (session) {
      logger.info({ userId: session.user?.id, userEmail: session.user?.email, hasSessionToken: !!session.session?.token, sessionData: session }, "Session details");
    }
    else {
      logger.info("No active session found");
    }
    logger.info("===============================================");

    // Get URL parameters for app authentication
    const { searchParams } = new URL(c.req.url);
    const redirectUri = searchParams.get("redirect_uri") || env.ANDROID_APP_REDIRECT_URI;
    const state = searchParams.get("state") || "default-state";

    logger.info({ redirectUri, state }, "Android Auth Params");

    // Store parameters in cookie for post-login redirect
    setCookie(c, "app_login_redirect_params", JSON.stringify({
      redirectUri,
      state,
      clientType: "android_app",
    }), {
      httpOnly: true,
      path: "/api", // Making it available for the auth route too
      maxAge: 60 * 10, // 10 minutes
    });

    // If user already has a session, redirect to app immediately with token
    if (session) {
      logger.info("User already has session, redirecting to app");
      const token = await createBearerToken(session);
      logger.info({ tokenGenerated: !!token }, "Generated token");
      deleteCookie(c, "app_login_redirect_params", { path: "/api" });
      logger.info({ redirectUrl: `${redirectUri}?token=${token}&state=${state}` }, "Redirecting to");
      return c.redirect(`${redirectUri}?token=${token}&state=${state}`);
    }

    // Get the current environment for determining the correct web URL
    const baseWebUrl = env.NODE_ENV === "production"
      ? "https://carsense.yourdomain.com" // Should add WEB_URL to env variables
      : "http://localhost:5173";

    // Otherwise redirect to sign-in page with special Android mode flag
    logger.info({ redirectUrl: `${baseWebUrl}/sign-in?mode=mobile&redirect=${encodeURIComponent(redirectUri)}&state=${state}` }, "Redirecting to sign-in page");
    return c.redirect(`${baseWebUrl}/sign-in?mode=mobile&redirect=${encodeURIComponent(redirectUri)}&state=${state}`);
  });
