import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { replicate } from "@/lib/replicate";
import { verifyAuth } from "@hono/auth-js";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkIsActive } from "@/features/subscriptions/lib";

const app = new Hono()
  .post(
    "/remove-bg",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        image: z.string(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { image } = c.req.valid("json");
      const input = {
        image: image,
      };

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      //check for subscription in database
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, auth.token.id));

      const active = checkIsActive(subscription);
      if (!subscription || !active) {
        return c.json({ error: "Subscription not found" }, 404);
      }

      const output: unknown = await replicate.run(
        "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        { input }
      );
      const res = output as string;
      return c.json({
        data: res,
      });
    }
  )
  .post(
    "/generate-image",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      })
    ),

    async (c) => {
      const auth = c.get("authUser");
      const { prompt } = c.req.valid("json");
      const input = {
        prompt: prompt,
        guidance_scale: 3.5,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
      };

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      //check for subscription in database
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, auth.token.id));

      const active = checkIsActive(subscription);
      if (!subscription || !active) {
        return c.json({ error: "Subscription not found" }, 404);
      }

      const output: unknown = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input,
        }
      );
      console.log(output);
      const res = output;
      console.log(res);
      return c.json({
        data: res,
      });
    }
  );

export default app;
