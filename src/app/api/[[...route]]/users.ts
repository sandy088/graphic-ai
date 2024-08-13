import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

const app = new Hono()
  .get("/verifyAdmin", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, auth.token.id));

    if (!user.isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: user.isAdmin });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })
    ),
    async (c) => {
      const { name, email, password } = c.req.valid("json");

      const hashedPassword = await bcrypt.hash(password, 12);

      const query = await db.select().from(users).where(eq(users.email, email));

      if (query?.length > 0) {
        return c.json({ error: "Email already exists" }, 400);
      }

      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
      });

      return c.json(null, 200);
    }
  );

export default app;
