import { Hono } from "hono";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { authRoute } from "./routes/authRoute";

const app = new Hono().use(logger());

const apiRoutes = app.basePath("/api").route("/auth/**", authRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
