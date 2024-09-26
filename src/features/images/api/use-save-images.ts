import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.images)["save-image"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.images)["save-image"]["$post"]
>["json"];

export const useSaveImage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["save-image"],
    mutationFn: async (json) => {
      const response = await client.api.images["save-image"].$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }
      return await response.json();
    },
    onSuccess: () => {
      //Invalidate the images query
      queryClient.invalidateQueries({ queryKey: ["saved-images"] });
    },
    onError: (error) => {
      toast.error("Failed to save image");
    },
  });
  return mutation;
};
