import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export type ResponseType = InferResponseType<
  (typeof client.api.images)["uploaded-images"]["$get"],
  200
>;
export const useGetSavedImages = () => {
  const query = useInfiniteQuery<ResponseType, Error>({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryKey: ["saved-images"],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.images["uploaded-images"].$get({
        query: {
          limit: "5",
          page: (pageParam as number).toString(),
        },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching Project");
      }

      return response.json();
    },
  });

  return query;
};
