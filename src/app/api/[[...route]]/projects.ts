import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { projectInsertSchema, projects } from "@/db/schema";
import { db } from "@/db/drizzle";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

const app = new Hono()
  .get(
    "/:id",
    verifyAuth(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const auth = c.get("authUser");
      const { id } = c.req.valid("param");

      if (!auth.token?.id) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, id), eq(projects.userId, auth.token.id)));

      if (data?.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data: data[0] });
    }
  )
  .post(
    "/",
    verifyAuth(),
    zValidator(
      "json",
      projectInsertSchema.pick({
        name: true,
        json: true,
        height: true,
        width: true,
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { name, json, height, width } = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db
        .insert(projects)
        .values({
          name,
          json,
          height,
          width,
          userId: auth.token.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!data[0]) {
        return c.json({ error: "Something went wrong" }, 400);
      }

      return c.json({ data: data[0] });
    }
  );

export default app;
