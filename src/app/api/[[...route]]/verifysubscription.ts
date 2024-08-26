import { zValidator } from "@hono/zod-validator";
import crypto from "crypto";
import { Hono } from "hono";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.post(
  "/verify",
  zValidator(
    "json",
    z.object({
      raz_signature: z.string(),
      raz_payment_id: z.string(),
      raz_sid: z.string(),
      planId: z.string(),
      razorpay_order_id: z.string().optional(),
    })
  ),
  async (c) => {
    const session = await auth();
    const {
      raz_signature,
      raz_payment_id,
      raz_sid,
      planId,
      razorpay_order_id,
    } = await c.req.json();
    //checks
    if (!raz_payment_id || !raz_sid || !raz_signature) {
      return c.json({ error: "Invalid request" }, 400);
    }

    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 404);
    }

    let isVerified: boolean;

    if (
      (planId === "1" || planId === "2" || planId === "3" || planId === "4") &&
      razorpay_order_id
    ) {
      const crypt = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      crypt.update(`${razorpay_order_id}|${raz_payment_id}`);
      const digest = crypt.digest("hex");
      isVerified = digest === raz_signature;

      if (!isVerified) {
        return c.json({ error: "payment verification failed" }, 400);
      }
    } else {
      const crypt = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      crypt.update(raz_payment_id + "|" + raz_sid);

      const digest = crypt.digest("hex");

      isVerified = digest === raz_signature;
      if (!isVerified) {
        return c.json({ error: "Payment verification failed" }, 404);
      }
    }

    if (planId === "1") {
      await db
        .update(users)
        .set({
          aitokens: 100,
        })
        .where(eq(users.id, session.user?.id));
    } else if (planId === "2") {
      await db
        .update(users)
        .set({
          aitokens: 220,
        })
        .where(eq(users.id, session.user?.id));
    } else if (planId === "3") {
      await db
        .update(users)
        .set({
          aitokens: 460,
        })
        .where(eq(users.id, session.user?.id));
    } else if (planId === "4") {
      await db
        .update(users)
        .set({
          aitokens: 1100,
        })
        .where(eq(users.id, session.user?.id));
    } else {
      //if already had subscription then simply update the currentPeriodEnd
      const existingSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, session.user?.id));
      if (existingSubscription.length > 0) {
        const update = await db
          .update(subscriptions)
          .set({
            status: "active",
            paymentId: raz_payment_id,
            subscriptionId: raz_sid,
            currentPeriodEnd: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, session.user?.id))
          .returning();

        return c.json({ data: isVerified }, 200);
      }

      await db.insert(subscriptions).values({
        userId: session.user?.id,
        subscriptionId: raz_sid,
        paymentId: raz_payment_id,
        customerId: session.user?.id,
        planId: planId,
        currentPeriodEnd: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ),
        status: "created",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return c.json({ data: isVerified }, 200);
  }
);

export default app;
