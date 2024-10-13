import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.upload)["upload-template"]["$post"],200>;
type RequestType = InferRequestType<
  (typeof client.api.upload)["upload-template"]["$post"]
>["json"];

export const useUploadProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.upload["upload-template"]["$post"]({ json });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      return await response.json();
    },
    onSuccess: () => {
        //TODO: Invalidate templates query
    //   queryClient.invalidateQueries({
    //     queryKey:["projects"]
    //   })
    },
    onError: (error) => {
      toast.error("Failed to upload template");
    },
  });
  return mutation;
};
