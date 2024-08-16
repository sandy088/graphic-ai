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
import { Loader, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ShapeSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ShapeSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ShapeSidebarProps) => {
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetAllElements();

  console.log("here is the data", data);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "shapes" ? "visible" : "hidden"
      )}
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
            data?.pages[0]?.data.map((page, index) => (
              <button
                key={page.id}
                className="w-full relative h-[100px] group bg-black/5 hover:opacity-75 transition  rounded-sm overflow-hidden "
                onClick={() => {
                  editor?.addImage(page.elementUrl);
                }}
              >
                <Image
                  src={page.elementUrl}
                  fill
                  alt={page.name || "Unsplash Image"}
                  className="object-cover"
                />
                <div
                   
                  
                    className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
                  >
                    {page.name} on Graphic-ai
                  </div>
              </button>
            ))}
        </div>
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
      </ScrollArea>

      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
