import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetTokens = () => {
  const query = useQuery({
    queryKey: ["aitokens"],
    queryFn: async () => {
      const res = await client.api.subscriptions["ai-tokens"].$get();

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
