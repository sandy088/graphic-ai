import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions)["checkout"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.subscriptions)["checkout"]["$post"]
>["json"];

export const useCreateSubscription = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.subscriptions.checkout.$post({ json });

      if (!response.ok) {
        throw new Error("An error occurred while creating a subscription");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log("An error occurred while creating a subscription", error);
    },
    onSuccess: () => {
      //   toast.success("Successfully created a subscription");
      console.log("Successfully created a subscription");
    },
  });
  return mutation;
};
