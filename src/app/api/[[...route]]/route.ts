import { Hono, Context } from "hono";
import { handle } from "hono/vercel";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";

import images from "./images";
import ai from "./ai";
import users from "./users";
import projects from "./projects";
import subscriptionRoute from "./subscription";
import subsVerifyRoute from "./verifysubscription";
import elementsRoute from "./elements";
import uploadTemplateRoute from "./upload";

import authConfig from "@/auth.config";

export const runtime = "nodejs";

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    ...authConfig,
  } as AuthConfig;
}

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
  .route("/ai", ai)
  .route("/projects", projects)
  .route("/images", images)
  .route("/users", users)
  .route("/subscriptions", subscriptionRoute)
  .route("/upload",uploadTemplateRoute)
  .route("/elements", elementsRoute);
  
app.route("/subs", subsVerifyRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
