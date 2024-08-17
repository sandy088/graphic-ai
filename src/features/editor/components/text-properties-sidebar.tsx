import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface TextPropertiesSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TextPropertiesSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TextPropertiesSidebarProps) => {
  const initialLineHeightValue = editor?.getTextLineHeight() || 1;
  //   const strokeTypeValue = editor?.getActiveStrokeDashArray() || [];
  const initialLetterSpacingValue = editor?.getLetterSpacing() || 0; 

  const [properties, setProperties] = useState({
    lineHeight: initialLineHeightValue,
    letterSpacing: initialLetterSpacingValue,
  });

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeLineHeight = (value: number) => {
    editor?.changeTextLineHeight(value);
    setProperties((prev) => ({ ...prev, lineHeight: value }));
  };

    const onChangeLetterSpacing = (value: number) => {
        editor?.changeLetterSpacing(value);
        setProperties((prev) => ({ ...prev, letterSpacing: value }));
    };

  //   const onChangeStrokeType = (value: number[]) => {
  //     console.log("changing stroke type: value", value);
  //     editor?.changeStrokeDashArray(value);
  //   };
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "text-properties" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Adjust Text Properties"
        description="Change the text properties of your text element"
      />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Label className=" text-sm">Text Line Height</Label>
          <Slider
            value={[properties.lineHeight]}
            min={0.2}
            max={5}
            step={0.01}
            onValueChange={(values) => onChangeLineHeight(values[0])}
          />
        </div>

        <div className=" p-4 space-y-4 border-b">
          <Label className=" text-sm">Letter Spacing</Label>
          <Slider
            value={[properties.letterSpacing]}
            min={1}
            max={100}
            step={1}
            onValueChange={(values) => onChangeLetterSpacing(values[0])}
          />
        </div>

        {/* <div className=" p-4 space-y-4 border-b">
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
        </div> */}
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
