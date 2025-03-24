import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoute } from "./routes/authRoute";
import { testRoute } from "./routes/testRoute";
import configureOpenAPI from "./lib/configure-open-api";
import { vehiclesRoute } from "./routes/vehiclesRoute";
import { auth } from "./lib/auth";
import { APIError } from "better-call";

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

const app = new Hono().use(logger());

configureOpenAPI(app);

const apiRoutes = app
  .basePath("/api")
  .route("/auth/**", authRoute)
  .route("/test", testRoute)
  .route("/vehicles", vehiclesRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
