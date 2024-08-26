import { useGetTokens } from "./use-get-tokens";
import { useBuyTokenModal } from "../store/use-buy-token";

export const useTokenPaywall = () => {
  const { data: tokens, isLoading: isLoadingSubscription } = useGetTokens();
  const subscriptionModal = useBuyTokenModal();

  const totalTokens = tokens || 0;
  const shouldBlock = totalTokens < 1 || totalTokens > 1100;
  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    data: {
      tokens: tokens,
    },
    triggerPaywall: () => subscriptionModal.open(),
  };
};
