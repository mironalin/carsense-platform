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

// Extract token from set-cookie header
function extractTokenFromCookie(setCookieHeader: string) {
  // Looking for something like __Secure-carsense_session_token=xyz.abc;
  const tokenMatch = setCookieHeader.match(/carsense_session_token=([^;]+)/);
  if (tokenMatch && tokenMatch[1]) {
    return tokenMatch[1];
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
    if (response.status === 200 || response.status === 302) {
      logger.info({}, "Auth successful, checking for app redirect needs");

      // Check if this was a successful login by looking for the session cookie in the response
      const setCookieHeader = response.headers.get("set-cookie") || "";
      const authCookies = setCookieHeader.split(",");
      const hasSessionToken = authCookies.some((cookie: string) => cookie.includes("carsense_session_token"));

      logger.info({ hasSessionCookie: hasSessionToken }, "Session cookie check in response");
      const appParamsCookie = getCookie(c, "app_login_redirect_params");

      if (hasSessionToken && appParamsCookie) {
        try {
          const appParams = JSON.parse(appParamsCookie);
          logger.info({ appParams }, "Parsed app params after auth");

          if (appParams.clientType === "android_app" && appParams.redirectUri) {
            // Extract token from the cookie
            let token = null;
            for (const cookie of authCookies) {
              const extractedToken = extractTokenFromCookie(cookie);
              if (extractedToken) {
                token = extractedToken;
                break;
              }
            }

            if (!token && setCookieHeader) {
              // Try extracting from the full header as a fallback
              token = extractTokenFromCookie(setCookieHeader);
            }

            if (!token) {
              logger.error({}, "Could not extract token from response cookies");
              return response;
            }

            logger.info({ tokenFound: !!token, fullTokenReceived: token }, "Token extraction from cookie");

            // Split the token if it contains a dot, send only the prefix to the app.
            let tokenToSendToApp = token;
            const dotIndex = token.indexOf(".");
            if (dotIndex !== -1) {
              tokenToSendToApp = token.substring(0, dotIndex);
              logger.info({ originalFullToken: token, tokenBeingSentToApp: tokenToSendToApp }, "Token was split at the first dot for app redirect.");
            }

            // Clear the app params cookie
            deleteCookie(c, "app_login_redirect_params", { path: "/api" });
            logger.info({}, "Cleared app_login_redirect_params cookie after auth");

            // Construct the redirect URL for the custom scheme
            const appRedirectUrl = `${appParams.redirectUri}?token=${encodeURIComponent(tokenToSendToApp)}&state=${encodeURIComponent(appParams.state)}`;
            logger.info({ appRedirectUrl }, "Post-auth redirect to app via HTML/JS");

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting...</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'">
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f4; color: #333; }
        .container { text-align: center; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
    <script type="text/javascript">
        window.onload = function() {
            // Embed server-side values as JavaScript string literals.
            // Escape any double quotes within the values themselves to prevent breaking the JS string.
            const rawTokenFromServer = "${tokenToSendToApp.replace(/"/g, "\\\\\"")} ";
            const rawStateFromServer = "${appParams.state.replace(/"/g, "\\\\\"")} ";
            const baseRedirectUri = "${appParams.redirectUri}";

            if (!rawTokenFromServer.trim() || !rawStateFromServer.trim() || !baseRedirectUri) {
                console.error("Token, state, or baseRedirectUri missing for redirect.");
                document.getElementById("message").textContent = "Error: Could not retrieve authentication details. Please try closing this window and opening the app again.";
                document.getElementById("spinner").style.display = "none";
                return;
            }

            // Trim whitespace from token and state that might have been introduced by template literals
            const finalToken = rawTokenFromServer.trim();
            const finalState = rawStateFromServer.trim();

            // Now, use encodeURIComponent when constructing the actual URL for navigation
            const redirectUrl = baseRedirectUri + "?token=" + encodeURIComponent(finalToken) + "&state=" + encodeURIComponent(finalState);
            console.log("Attempting to redirect to: " + redirectUrl);
            document.getElementById("message").textContent = "Redirecting to CarSense app...";
            try {
                window.location.href = redirectUrl;
                setTimeout(function() {
                    window.close();
                }, 1000);
            } catch (e) {
                console.error("Error attempting to redirect:", e);
                const escapedErrorMessage = e.message ? e.message.replace(/"/g, "&quot;") : "Unknown error";
                document.getElementById("message").innerHTML = "Could not automatically redirect. Please return to the app manually or <a href=\\"" + redirectUrl + "\\">click here to try again</a>. Error: " + escapedErrorMessage;
                document.getElementById("spinner").style.display = "none";
                document.getElementById("manualRedirectLink").href = redirectUrl;
                document.getElementById("manualRedirectLinkContainer").style.display = "block";
            }
        };
    </script>
</head>
<body>
    <div class="container">
        <div id="spinner" class="spinner"></div>
        <p id="message">Authenticating, please wait...</p>
        <div id="manualRedirectLinkContainer" style="display:none; margin-top: 20px;">
            <p>If you are not redirected, <a id="manualRedirectLink" href="#">click here to return to the app</a>.</p>
        </div>
    </div>
</body>
</html>`;
            return c.html(htmlContent);
          }
        }
        catch (e) {
          logger.error({ error: e }, "Error handling post-auth redirect");
        }
      }
    }

    return response;
  });
