import { db } from "@/db/drizzle";
import { images } from "@/db/schema";
import { unsplash } from "@/lib/unsplash";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import crypto from "crypto";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const DEFAULT_COUNT = 10;
const DEFAULT_COLLECTION_IDS = ["317099"];

const app = new Hono()
  .get(
    "/uploaded-images",
    zValidator(
      "query",
      z.object({ page: z.coerce.number(), limit: z.coerce.number() })
    ),
    verifyAuth(),
    async (c) => {
      const session = c.get("authUser");
      const { page, limit } = c.req.valid("query");

      if (!session.token?.id) {
        return c.json({ error: "Unauthorized" }, 400);
      }

      const allImages = await db
        .select()
        .from(images)
        .where(eq(images.userId, session.token.id))
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(desc(images.createdAt));

      if (!allImages) {
        return c.json({ error: "No images found" }, 400);
      }

      return c.json(
        {
          data: allImages,
          nextPage: allImages.length === limit ? page + 1 : null,
        },
        200
      );
    }
  )
  .post(
    "/save-image",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        imageUrl: z.string(),
      })
    ),

    async (c) => {
      const session = c.get("authUser");
      const { imageUrl } = c.req.valid("json");

      if (!session.token?.id) {
        return c.json({ error: "Unauthorized" }, 400);
      }

      //save image url to db
      const [image] = await db
        .insert(images)
        .values({
          userId: session.token.id,
          name: crypto.randomUUID(),
          url: imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!image) {
        return c.json({ error: "Failed to save image" }, 400);
      }

      return c.json({ data: image }, 200);
    }
  )
  .get("/", verifyAuth(), async (c) => {
    const images = await unsplash.photos.getRandom({
      count: DEFAULT_COUNT,
      collectionIds: DEFAULT_COLLECTION_IDS,
    });

    if (images.errors) {
      return c.json(
        {
          error: "Something went wrong",
        },
        400
      );
    }

    let response = images.response;

    if (!Array.isArray(response)) {
      response = [response];
    }
    return c.json({
      data: response,
    });
  });

export default app;
