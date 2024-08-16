import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verifyAuth } from "@hono/auth-js";
import { db } from "@/db/drizzle";
import { elements } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono().get(
  "/all-elements",
  verifyAuth(),
  zValidator(
    "query",
    z.object({
      // element type can only be Graphic, Icon, Image
      elementType: z.string().optional(),
      page: z.coerce.number(),
      limit: z.coerce.number(),
    })
  ),
  async (c) => {
    const { elementType, page, limit } = c.req.valid("query");
    const session = c.get("authUser");

    if (!session.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!elementType) {
      const elms = await db
        .select()
        .from(elements)
        .limit(limit)
        .offset((page - 1) * limit);
      return c.json({
        data: elms,
        nextPage: elms.length === limit ? page + 1 : null,
      });
    }

    const elms = await db
      .select()
      .from(elements)
      .where(eq(elements.elementType, elementType))
      .limit(limit)
      .offset((page - 1) * limit);

    return c.json({
      data: elms,
      nextPage: elms.length === limit ? page + 1 : null,
    });
  }
);

export default app;
