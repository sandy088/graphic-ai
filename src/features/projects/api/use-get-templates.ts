import { client } from "@/lib/hono";
import { InferRequestType , InferResponseType} from "hono";
import { useQuery
 } from "@tanstack/react-query";

 export type ResponseType = InferResponseType<
  (typeof client.api.projects)["templates"]["$get"],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.projects)["templates"]["$get"]
>["query"];

 export const useGetTemplates = (apiQuery:RequestType) => {
    const query = useQuery({
        queryKey: ["templates",{
            page: apiQuery.page,
            limit: apiQuery.limit
        }],
        queryFn: async() => {
            const response = await client.api.projects.templates.$get({
                query: apiQuery
            });
            if(!response.ok) {
                throw new Error("An error occurred while fetching templates");
            }

            const {data} = await response.json();
            return data;
        }
    })

    return query;
 }