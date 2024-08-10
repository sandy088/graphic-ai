import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await client.api.subscriptions.current.$get();

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
