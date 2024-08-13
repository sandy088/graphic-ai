import { useVerifyAdmin } from "./use-verify-admin";

export const useAdminVerification = () => {
  const {
    data: isAdmin,
    isLoading: isLoadingSubscription,
  } = useVerifyAdmin();

  const shouldBlock = !isAdmin; 
  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
  };
};
