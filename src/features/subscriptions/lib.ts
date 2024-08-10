import { subscriptions } from "@/db/schema";
const day_IN_MS = 84_400_000;

export const checkIsActive = (
  subscription: typeof subscriptions.$inferSelect
) => {
  let active = false;

  if (
    subscription &&
    subscription.subscriptionId &&
    subscription.currentPeriodEnd
  ) {
    active = subscription.currentPeriodEnd.getTime() + day_IN_MS > Date.now();
  }

  return active;
};
