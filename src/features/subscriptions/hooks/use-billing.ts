import { useMutation, useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions)["billing"]["$get"],200
>;

export const useBilling = () => {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["billing"],
    queryFn: async () => {
      const response = await client.api.subscriptions.billing.$get();

      if (!response.ok) {
        throw new Error("An error occurred while fetching subscription details");
      }
      return await response.json();
    }
  });
  return query;
};
