import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { z } from "zod";
import "zod-openapi/extend";

const querySchema = z
  .object({
    name: z.string().optional().openapi({ example: "Steven" }),
  })
  .openapi({ ref: "Query" });

const responseSchema = z.string().openapi({ example: "Hello Steven!" });

export const testRoute = new Hono().get(
  "/",
  describeRoute({
    description: "Say hello to the user",
    responses: {
      200: {
        description: "Successful greeting response",
        content: {
          "text/plain": {
            schema: resolver(responseSchema),
          },
        },
      },
    },
  }),
  zValidator("query", querySchema),
  (c) => {
    const query = c.req.valid("query");
    return c.json({
      message: `Hello ${query.name
      ?? "World"}! This is a test route for Hono!`,
    });
  },
);
