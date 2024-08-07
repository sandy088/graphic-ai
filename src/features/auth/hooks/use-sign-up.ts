import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.users)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.users)["$post"]
>["json"];

export const useSignUp = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.users["$post"]({ json });

      if(!response.ok) {
        throw new Error("An error occurred while signing up");
      }
      return await response.json();
    },
    // onError: (error) => {
    //  toast.error(error.message);
    // },
    onSuccess: () => {
      toast.success("Successfully signed up");
    }
  });
  return mutation;
};
