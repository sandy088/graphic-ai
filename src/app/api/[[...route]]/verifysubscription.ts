import { zValidator } from "@hono/zod-validator";
import crypto from "crypto";
import { Hono } from "hono";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
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
    })
  ),
  async (c) => {
    const session = await auth();
    const { raz_signature, raz_payment_id, raz_sid, planId } =
      await c.req.json();
    //checks
    if (!raz_payment_id || !raz_sid || !raz_signature) {
      return c.json({ error: "Invalid request" }, 400);
    }

    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 404);
    }

    const crypt = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    crypt.update(raz_payment_id + "|" + raz_sid);

    const digest = crypt.digest("hex");

    const isVerified = digest === raz_signature;
    if (!isVerified) {
      return c.json({ error: "Payment verification failed" }, 404);
    }

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

    return c.json({ data: isVerified }, 200);
  }
);

export default app;
