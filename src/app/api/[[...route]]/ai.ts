import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { replicate } from "@/lib/replicate";

const app = new Hono()
  .post(
    "/remove-bg",
    zValidator(
      "json",
      z.object({
        image: z.string(),
      })
    ),
    async (c) => {
      const { image } = c.req.valid("json");
      const input = {
        image: image,
      };

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
    zValidator(
      "json",
      z.object({
        prompt: z.string(),
      })
    ),

    async (c) => {
      const { prompt } = c.req.valid("json");
      const input = {
        prompt: prompt,
        guidance: 3.5,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
      };

      const output: unknown = await replicate.run(
        "black-forest-labs/flux-dev",
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
