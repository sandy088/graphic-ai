import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkIsActive } from "@/features/subscriptions/lib";

const app = new Hono()
  .post("/billing", verifyAuth(), async (c) => {
    const auth = c.get("authUser");

    if (!auth.token?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [subscription]=await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id))
    
    if(!subscription){
      return c.json({error: "Subscription not found"}, 404)
    }

    const session = await razorpay.subscriptions.fetch(subscription.subscriptionId);
   
    if(!session){
      return c.json({error: "Subscription not found"}, 404)
    }

    return c.json({ data: session },200);

  })
  .get("/current",

    verifyAuth(),
    async (c)=>{
      const auth = c.get("authUser");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const [subscription]=await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, auth.token.id))

      const active = checkIsActive(subscription)
      return c.json({data: {...subscription, active}})
    }
  )
  .post(
    "/verify-payment",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        raz_signature: z.string(),
        raz_payment_id: z.string(),
        raz_sid: z.string(),
      })
    ),

    async (c) => {
      const auth = c.get("authUser");
      const { raz_signature, raz_payment_id, raz_sid } = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 404);
      }

      const crypt = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET_KEY!
      );
      crypt.update(raz_payment_id + "|" + raz_sid);

      const digest = crypt.digest("hex");

      const isVerified = digest === raz_signature;
      if (!isVerified) {
        return c.json({ error: "Payment verification failed" }, 404);
      }

      return c.json({ data: isVerified }, 200);
    }
  )
  .post(
    "/checkout",
    verifyAuth(),
    zValidator(
      "json",
      z.object({
        planId: z.string(),
      })
    ),
    async (c) => {
      const auth = c.get("authUser");
      const { planId } = c.req.valid("json");

      if (!auth.token?.id) {
        return c.json({ error: "Unauthorized" }, 404);
      }

      const razorppaySubscriptionOptions = {
        plan_id: planId,
        customer_notify: true,
        quantity: 1,
        total_count: 1,
        notes: {
          note_key:
            "contact me at sandeeppakho55@gmail.com if you faced any problem",
        },
      };

      const subscription = await razorpay.subscriptions.create(
        razorppaySubscriptionOptions
      );

      if (!subscription || !subscription.id) {
        return c.json({ error: "Subscription creation failed" }, 404);
      }

      return c.json({ data: subscription });
    }
  );

export default app;
