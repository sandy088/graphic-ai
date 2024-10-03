import { cn } from "@/lib/utils";
import { ActiveTool, Editor, STROKE_COLOR, STROKE_WIDTH } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./color-picker";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DrawSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const DrawSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: DrawSidebarProps) => {
  const colorValue = editor?.getActiveStrokeColor() || STROKE_COLOR;
  const widthValue = editor?.getActiveStrokeWidth() || STROKE_WIDTH;

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onBrushColorChange = (value: string) => {
    editor?.changeStrokeColor(value);
  };
  const onBrushWidthChange = (value: number) => {
    editor?.changeStrokeWidth(value);
  };
  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "draw" ? "visible" : "hidden"
      )}
    >
      <div
        className="bg-white relative border-r z-[40] w-[360px] h-full flex flex-col rounded-md"
      >

   
      <ToolSidebarHeader title="Draw" description="Modify Brush settings" />
      <ScrollArea>
        <div className=" p-4 space-y-6 border-b">
          <Label className=" text-sm">Brush width</Label>
          <Slider
            value={[widthValue]}
            onValueChange={(values) => onBrushWidthChange(values[0])}
          />
        </div>

        <div className=" p-4 space-y-6">
          <ColorPicker value={colorValue} onChange={onBrushColorChange} />
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />   </div>
    </aside>
  );
};
