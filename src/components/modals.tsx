"use client";

import { BuyTokenModal } from "@/features/subscriptions/store/components/buy-token-modal";
import { SubscriptionModal } from "@/features/subscriptions/store/components/subscription-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SubscriptionModal />
      <BuyTokenModal />
    </>
  );
};
