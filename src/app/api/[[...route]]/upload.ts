import { db } from "@/db/drizzle";
import { projects, users } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().post(
  "/upload-template",
  verifyAuth(),
  zValidator(
    "json",
    z.object({
      thumbnailUrl: z.string(),
      templateId: z.string(),
    })
  ),
  async (c) => {
    const { thumbnailUrl, templateId } = c.req.valid("json");
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    //check if user is admin- first fetch user from db
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.token.id));

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (!user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    //update template with thumbnailUrl and make it a template by setting isTemplate to true
    try {
      await db
        .update(projects)
        .set({
          thumbnailUrl: thumbnailUrl,
          isTemplate: true,
        })
        .where(eq(projects.id, templateId));

      return c.json({ message: "Template uploaded successfully" }, 200);
    } catch (error) {
      return c.json({ error: "Error uploading template" }, 500);
    }
  }
);

export default app;
