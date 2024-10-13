"use client";

import { useGetAllElements } from "@/features/elements/api/use-get-all-elements";
import { AlertTriangle, CloudDownload, Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Editor } from "../types";
import { Button } from "@/components/ui/button";

interface ElementsListProps {
  editor: Editor | undefined;
}

export const ElementsList = ({ editor }: ElementsListProps) => {
  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useGetAllElements();

  if (isLoading) {
    return (
      <div className=" flex items-center justify-center flex-1">
        <Loader className="size-4 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (isError) {
    <div className=" flex flex-col gap-y-4 items-center justify-center flex-1">
      <AlertTriangle className="size-4 text-muted-foreground" />
      <p className=" text-muted-foreground text-xs">Failed to load Elements</p>
    </div>;
  }
  return (
    <div className=" grid grid-cols-3 gap-4 p-4">
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((element) => (
            <button
              key={element.id}
              className="w-full relative h-[100px] group bg-black/5 hover:opacity-75 transition  rounded-sm overflow-hidden "
              onClick={() => {
                editor?.addImage(element.elementUrl);
              }}
            >
              <Image
                src={element.elementUrl}
                fill
                alt={element.name || "Graphic element"}
                className="object-cover"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left">
                {element.name} on Graphic-ai
              </div>
            </button>
          ))}
        </React.Fragment>
      ))}

      <div className=" w-full">
        {status === "success" &&
          data?.pages[data.pages.length - 1].nextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant={"outline"}
              className="w-full h-full flex justify-center items-center flex-col text-muted-foreground text-xs"
            >
              <CloudDownload
               className=" size-4 text-muted-foreground mb-1"
              />
              Load more
            </Button>
          )}
      </div>
    </div>
  );
};
