import type { Hono } from "hono";

import { apiReference } from "@scalar/hono-api-reference";
import { openAPISpecs } from "hono-openapi";

export default function configureOpenAPI(app: Hono) {
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
            version: "1.0.0",
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
        spec: {
          url: "/openapi",
        },
      }),
    );
}
