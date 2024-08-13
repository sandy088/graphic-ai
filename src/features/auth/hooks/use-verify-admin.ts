import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";

export type ResponseType = InferResponseType<(typeof client.api.users["verifyAdmin"]["$get"]),200>;
export const useVerifyAdmin = () => {  
  const query = useQuery({
    queryKey: ["verifyAdmin"],
    queryFn: async () => {
      const response = await client.api.users["verifyAdmin"]["$get"]();
      if (!response.ok) {
        throw new Error("An error occurred while fetching Project");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
