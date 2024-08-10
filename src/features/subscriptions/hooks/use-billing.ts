import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions)["billing"]["$post"]
>;

export const useBilling = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.subscriptions.billing.$post();

      if (!response.ok) {
        throw new Error("An error occurred while fetching subscription details");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log("An error occurred while fetching subscriptions details", error);
    },
    onSuccess: (data) => {
      //   toast.success("Successfully created a subscription");
      console.log("here is the data from hook:", data);
      console.log("Successfully fetched your subscription");
    },
  });
  return mutation;
};
