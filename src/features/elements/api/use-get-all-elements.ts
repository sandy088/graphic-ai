import { client } from "@/lib/hono";
import { InferResponseType } from "hono";
import { useInfiniteQuery } from "@tanstack/react-query";

export type ResponseType = InferResponseType<(typeof client.api.elements)["all-elements"]["$get"],200>;
export const useGetAllElements = () => {  
  const query = useInfiniteQuery<ResponseType, Error>({
    initialPageParam:1,
    getNextPageParam: (lastPage)=>lastPage.nextPage,
    queryKey: ["elements"],
    queryFn: async ({pageParam}) => {
      const response = await client.api.elements["all-elements"]['$get']({
        query:{
            limit:"5",
            page: (pageParam as number).toString()
        }
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching Project");
      }

      return response.json();
    },
  });

  return query;
};
