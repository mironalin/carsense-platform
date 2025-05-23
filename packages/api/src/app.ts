import configureOpenAPI from "./lib/configure-open-api";
import { createApp } from "./lib/create-app";
import { authRoute } from "./routes/auth-route";
import { dtcRoute } from "./routes/dtc-route";
import { testRoute } from "./routes/test-route";
import { vehiclesRoute } from "./routes/vehicles-route";

import { diagnosticsRoute } from "./routes/diagnostics-route";
import { locationsRoute } from "./routes/locations-route";
import { mlPredictionsRoute } from "./routes/ml-predictions";
import { mlModelsRoute } from "./routes/ml-models";
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
  .route("/auth/**", authRoute)
  .route("/test", testRoute)
  .route("/vehicles", vehiclesRoute)
  .route("/diagnostics", diagnosticsRoute)
  .route("/locations", locationsRoute)
  .route("/dtc", dtcRoute)
  .route("/ml/predictions", mlPredictionsRoute)
  .route("/ml/models", mlModelsRoute);

export default app;
export type AppType = typeof apiRoutes;
