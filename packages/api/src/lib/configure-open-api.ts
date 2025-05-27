import { apiReference } from "@scalar/hono-api-reference";
import { config } from "dotenv";
import { openAPISpecs } from "hono-openapi";

import type { AppOpenApi } from "./types";

import packageJSON from "../../../../package.json";
import env from "../../env";

config({ path: ".env" });

export default function configureOpenAPI(app: AppOpenApi) {
  app
    .get(
      "/openapi",
      openAPISpecs(app, {
        documentation: {
          components: {
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
              },
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
          info: {
            title: "CarSense",
            version: packageJSON.version,
            description: "CarSense API",
          },
          servers: [
            {
              url: env.NODE_ENV === "production" ? env.PROD_DEV_URL : env.LOCAL_API_DEV_URL,
              description: "Local development server",
            },
          ],
        },
      }),
    )
    .get(
      "/docs",
      apiReference({
        theme: "saturn",
        url: "/openapi",
      }),
    );
}
