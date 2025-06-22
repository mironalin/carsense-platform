import configureOpenAPI from "./lib/configure-open-api";
import { createApp } from "./lib/create-app";
import { androidAuthRoute } from "./routes/android-auth-route";
import { authRoute } from "./routes/auth-route";
import { diagnosticsRoute } from "./routes/diagnostics-route";
import { dtcRoute } from "./routes/dtc-route";
import { locationsRoute } from "./routes/locations-route";
import { notificationsRoute } from "./routes/notifications-route";
import { ownershipTransfersRoute } from "./routes/ownership-transfers-route";
import { sessionStatusRoute } from "./routes/session-status-route";
import { testRoute } from "./routes/test-route";
import { vehiclesRoute } from "./routes/vehicles-route";
// try {
//   const result = await auth.api.signInEmail({
//     body: {
//       email: "test@example.com",
//       password: "password",
//     },
//     asResponse: true,
//   });

//   console.log(result.headers.get("set-auth-token"));
// } catch (error) {
//   if (error instanceof APIError) {
//     console.log(error.message, error.status);
//   }
// }

const app = createApp();

configureOpenAPI(app);

export const apiRoutes = app
  .basePath("/api")
  .route("/auth/*", authRoute)
  .route("/android-auth", androidAuthRoute)
  .route("/session-status", sessionStatusRoute)
  .route("/test", testRoute)
  .route("/vehicles", vehiclesRoute)
  .route("/diagnostics", diagnosticsRoute)
  .route("/locations", locationsRoute)
  .route("/dtc", dtcRoute)
  .route("/notifications", notificationsRoute)
  .route("/ownership-transfers", ownershipTransfersRoute);

app.get("*", c => c.env.ASSETS.fetch(c.req.raw));

export default app;
export type AppType = typeof apiRoutes;
