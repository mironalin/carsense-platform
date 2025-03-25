import { Hono } from "hono";
import { hc } from "hono/client";
import { logger } from "hono/logger";
import { notFound, onError } from "stoker/middlewares";

import configureOpenAPI from "@/lib/configure-open-api";
import { authRoute } from "@/routes/auth-route";
import { testRoute } from "@/routes/test-route";
import { vehiclesRoute } from "@/routes/vehicles-route";

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

const app = new Hono().use(logger()).notFound(notFound).onError(onError);

configureOpenAPI(app);

export const apiRoutes = app
  .basePath("/api")
  .route("/auth/**", authRoute)
  .route("/test", testRoute)
  .route("/vehicles", vehiclesRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
