import { cn } from "@/lib/utils";
import { ActiveTool, Editor, filters } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ImageFiltersSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageFilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ImageFiltersSidebarProps) => {
  const value = editor?.getActiveImageFilters() || [];
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "filter" ? "visible" : "hidden"
      )}
    >
      <div
       className="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col rounded-md"
      >

      
      <ToolSidebarHeader title="Image Filters" description="Apply filters to your image" />
      <ScrollArea>
        <div className=" p-4 space-y-2 border-b">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={"secondary"}
              size={"lg"}
              className={cn(
                "w-full h-16 justify-start text-left",
                value[0] === filter && "border-2 border-blue-500"
              )}
              onClick={() => {
                editor?.changeImageFilter(filter);
              }}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} /></div>
    </aside>
  );
};
