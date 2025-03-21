import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { apiReference } from "@scalar/hono-api-reference";

export default function configureOpenAPI(app: Hono) {
  app
    .get(
      "/openapi",
      openAPISpecs(app, {
        documentation: {
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
