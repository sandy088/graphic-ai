import React from "react";
import { useSubscriptionModal } from "../store/use-subscription-modal";
import { useGetSubscription } from "./use-get-subscription";
import { useAiExhaustedModal } from "../store/use-ai-exhaustem-modal";

export const usePaywall = () => {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription();
  const subscriptionModal = useSubscriptionModal();
  const AiExhaustedModal = useAiExhaustedModal();

  const shouldBlock = !subscription?.active;
  //@ts-ignore - because it never be null
  const aiImgeGenerationLimitReached = subscription?.imageGenerationLimit < 1;
  //@ts-ignore - because it never be null
  const aiImageRmgLimitReached = subscription?.imageRmgLimit < 1;

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    aiImgeGenerationLimitReached,
    aiImageRmgLimitReached,
    data: {
      active: subscription?.active ?? false,
      subscriptionId: subscription?.subscriptionId,
      currentPeriodEnd: subscription?.currentPeriodEnd,
    },
    triggerPaywall: () => subscriptionModal.open(),
    triggerAiExhaustedModal: () => AiExhaustedModal.open(),
  };
};
