import { cn } from "@/lib/utils";
import { ActiveTool, Editor, STROKE_WIDTH } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface StrokeWidthSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const StrokeOptionsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: StrokeWidthSidebarProps) => {
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;
  const strokeTypeValue = editor?.getActiveStrokeDashArray() || [];

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeStrokeWidth = (value: number) => {
    editor?.changeStrokeWidth(value);
  };

  const onChangeStrokeType = (value: number[]) => {
    console.log("changing stroke type: value", value);
    editor?.changeStrokeDashArray(value);
  };
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Adjust Stroke"
        description="Change the stroke width of your element"
      />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Label className=" text-sm">Stroke Width</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onChangeStrokeWidth(values[0])}
          />
        </div>

        <div className=" p-4 space-y-4 border-b">
          <Label className=" text-sm">Stroke Type</Label>
          <Button
            onClick={() => onChangeStrokeType([])}
            variant={"secondary"}
            size={"lg"}
            className={cn(
              "w-full h-16 justify-start text-left px-[16px] py-[8px] ",
              strokeTypeValue.length === 0 && "border-2 border-blue-500"
            )}
          >
            <div className=" w-full border-black rounded-full border-4" />
          </Button>
          <Button
            onClick={() => onChangeStrokeType([5, 5])}
            variant={"secondary"}
            size={"lg"}
            className={cn(
              "w-full h-16 justify-start text-left px-[16px] py-[8px] ",
              strokeTypeValue.length === 2 && "border-2 border-blue-500"
            )}
          >
            <div className=" w-full border-black rounded-full border-4 border-dashed" />
          </Button>
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
