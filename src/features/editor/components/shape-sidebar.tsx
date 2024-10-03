import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShapeTool } from "./shape-tool";
import { FaCircle, FaSquare, FaSquareFull } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { useGetAllElements } from "@/features/elements/api/use-get-all-elements";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
  imgUri: string;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
  imgUri,
}: ShapeSidebarProps) => {
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetAllElements();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "shapes" ? "visible" : "hidden"
      )}
    >
      <div
       className="bg-white relative border-r rounded-md z-[40] w-[360px] h-full flex flex-col"
      >

      
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your design"
      />
      <ScrollArea>
        <div className=" grid grid-cols-3 gap-4 p-4">
          {/* TODO: Can do it better with map function */}
          <ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
          <ShapeTool onClick={() => editor?.addRectangle()} icon={FaSquare} />
          <ShapeTool
            onClick={() => editor?.addFullRectangle()}
            icon={FaSquareFull}
          />
          <ShapeTool onClick={() => editor?.addTriangle()} icon={IoTriangle} />
          <ShapeTool
            onClick={() => editor?.addRotatedTriangle()}
            icon={IoTriangle}
            iconClassName="rotate-180"
          />
          <ShapeTool onClick={() => editor?.addDiamond()} icon={FaDiamond} />
        </div>

        {/* Elements  */}
        <Separator />
        <ToolSidebarHeader
          title="Elements"
          description="Add elements to your design"
        />

        <div className=" grid grid-cols-3 gap-4 p-4">
          {/* Elements will come here  */}
          {status === "success" &&
            data?.pages.map((page, index) => (
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
        </div>
        <div className=" w-full px-4">

        {status === "success" &&
          data?.pages[data.pages.length - 1].nextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant={"outline"}
              className="w-full"
            >
              Load more
            </Button>
          )}
        </div>
      </ScrollArea>

      <ToolSideBarClose onClick={onClose} /></div>
    </aside>
  );
};
