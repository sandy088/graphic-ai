"use client";
import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Editor } from "../types";
import { useGetSavedImages } from "@/features/images/api/use-get-uploaded-images";
import { Button } from "@/components/ui/button";

interface ElementsListProps {
  editor: Editor | undefined;
}

export const UploadedImagesList = ({ editor }: ElementsListProps) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useGetSavedImages();

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

  if (data?.pages[0].data.length === 0) {
    return (
      <div className=" flex flex-col gap-y-4 items-center justify-center flex-1">
        <AlertTriangle className="size-4 text-muted-foreground" />
        <p className=" text-muted-foreground text-xs">No images uploaded yet</p>
      </div>
    );
  }
  return (
    <div className=" grid grid-cols-3 gap-4 p-4">
      {data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.data.map((image) => (
            <button
              key={image.id}
              className="w-full relative h-[100px] group bg-black/5 hover:opacity-75 transition  rounded-sm overflow-hidden "
              onClick={() => {
                editor?.addImage(image.url);
              }}
            >
              <Image
                src={image.url}
                fill
                alt={image.name || "Saved  Image"}
                className="object-contain"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left">
                {image.name} on Graphic-ai
              </div>
            </button>
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <div
          className=" w-full
       col-span-3
      "
        >
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
