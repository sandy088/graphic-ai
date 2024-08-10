import React from "react";
import { useSubscriptionModal } from "../store/use-subscription-modal";

export const usePaywall = () => {
  const subscriptionModal = useSubscriptionModal();

  const shouldBlock = true; //TODO: fetch from server
  return {
    isLoading: false,
    shouldBlock,
    triggerPaywall: () => subscriptionModal.open(),
  };
};
