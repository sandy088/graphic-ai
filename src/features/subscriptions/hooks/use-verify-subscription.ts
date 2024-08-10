import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions)["verify-payment"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.subscriptions)["verify-payment"]["$post"]
>["json"];

export const useVerifySubscription = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.subscriptions["verify-payment"].$post({ json });

      if (!response.ok) {
        throw new Error("An error occurred while checking a subscription");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log("An error occurred while checking a subscription", error);
    },
    onSuccess: () => {
      toast.success("Successfully subscribed the paid plan");
      console.log("Successfully subscribed the paid plan");
    },
  });
  return mutation;
};
