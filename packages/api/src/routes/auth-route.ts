import type { PinoLogger } from "hono-pino";

import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";

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

export const authRoute = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    logger: PinoLogger;
  };
}>()
  // Add simple logging middleware to confirm the route is being hit
  .use("*", async (c, next) => {
    const logger = c.get("logger");

    logger.info({ method: c.req.method, url: c.req.url }, "AUTH ROUTE HIT");
    return next();
  })
  .on(["POST", "GET"], "/", async (c) => {
    const logger = c.get("logger");

    logger.info({ method: c.req.method, path: c.req.path }, "AUTH HANDLER");

    // Get current session
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    // Enhanced session logging
    logger.info({}, "========== AUTH ROUTE SESSION DETAILS ==========");
    logger.info({ sessionExists: !!session }, "Session check");
    if (session) {
      logger.info(
        {
          userId: session.user?.id,
          userEmail: session.user?.email,
          hasSessionToken: !!session.session?.token,
          sessionData: session,
        },
        "Session details",
      );
    }
    else {
      logger.info({}, "No active session found");
    }
    logger.info({}, "===============================================");

    // Set session variables for middleware access
    c.set("user", session?.user || null);
    c.set("session", session?.session || null);

    // Get stored app parameters if they exist
    const appParamsCookie = getCookie(c, "app_login_redirect_params");
    logger.info({ cookieFound: !!appParamsCookie }, "App params cookie check");

    // If there's a cookie with app params and we have a session, this is likely a post-login redirect
    if (appParamsCookie && session) {
      logger.info({ cookieValue: appParamsCookie }, "App params cookie found");
      try {
        const appParams = JSON.parse(appParamsCookie);
        logger.info({ appParams }, "Parsed app params");
        if (appParams.clientType === "android_app" && appParams.redirectUri) {
          logger.info({}, "User authenticated with app params present");

          // Generate token for app authentication
          const token = await createBearerToken(session);
          logger.info({ success: !!token }, "Token generation");
          if (!token) {
            logger.error({}, "Failed to create bearer token");
            return auth.handler(c.req.raw);
          }

          // Clear the cookie
          deleteCookie(c, "app_login_redirect_params", { path: "/api" });
          logger.info({}, "Cleared app_login_redirect_params cookie");

          // Redirect back to app with token
          const redirectUrl = `${appParams.redirectUri}?token=${token}&state=${appParams.state}`;
          logger.info({ redirectUrl }, "Redirecting to app");
          return c.redirect(redirectUrl);
        }
      }
      catch (e) {
        logger.error({ error: e }, "Error processing app redirect");
      }
    }

    // Default behavior - handle with better-auth
    logger.info({}, "Using default auth handler");
    const response = await auth.handler(c.req.raw);
    logger.info({ status: response.status }, "Auth handler response");

    // After authentication is successful, check if we need to redirect to Android app
    // This will catch scenarios where the user just authenticated
    if (response.status === 200 || response.status === 302) {
      logger.info({}, "Auth successful, checking for app redirect needs");
      try {
        // Check if there's now a session after login
        const updatedSession = await auth.api.getSession({ headers: c.req.raw.headers });
        logger.info({ sessionExists: !!updatedSession }, "Updated session after auth");
        const appParamsCookie = getCookie(c, "app_login_redirect_params");
        logger.info({ cookieFound: !!appParamsCookie }, "App params cookie after auth");

        if (updatedSession && appParamsCookie) {
          const appParams = JSON.parse(appParamsCookie);
          logger.info({ appParams }, "Parsed app params after auth");
          if (appParams.clientType === "android_app" && appParams.redirectUri) {
            // Generate token for app authentication
            const token = await createBearerToken(updatedSession);
            logger.info({ success: !!token }, "Post-auth token generation");

            // Clear the cookie
            deleteCookie(c, "app_login_redirect_params", { path: "/api" });
            logger.info({}, "Cleared app_login_redirect_params cookie after auth");

            // Redirect to app with token
            const redirectUrl = `${appParams.redirectUri}?token=${token}&state=${appParams.state}`;
            logger.info({ redirectUrl }, "Post-auth redirect to app");
            return c.redirect(redirectUrl);
          }
        }
      }
      catch (e) {
        logger.error({ error: e }, "Error handling post-auth redirect");
      }
    }

    return response;
  });
