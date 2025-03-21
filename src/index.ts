import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoute } from "./routes/authRoute";
import { testRoute } from "./routes/testRoute";
import configureOpenAPI from "./lib/configureOpenAPI";

const app = new Hono().use(logger());

configureOpenAPI(app);

const apiRoutes = app
  .basePath("/api")
  .route("/auth/**", authRoute)
  .route("/test", testRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
