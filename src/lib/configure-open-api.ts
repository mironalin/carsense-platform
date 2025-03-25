import { apiReference } from "@scalar/hono-api-reference";
import { openAPISpecs } from "hono-openapi";

import type { AppOpenApi } from "./types";

import packageJSON from "../../package.json";

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
              url: "http://localhost:3000",
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
