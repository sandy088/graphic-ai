"use client";
import { ActiveTool, Editor } from "../types";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { BsBorderWidth } from "react-icons/bs";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();

  if (editor?.selectObjects.length === 0) {
    return (
      <div className=" shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"></div>
    );
  }

  return (
    <div className=" shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className=" flex items-center h-full justify-center">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "fill" && "bg-gray-100")}
          >
            <div
              className=" rounded-sm size-4 border"
              style={{
                backgroundColor: fillColor,
              }}
            />
          </Button>
        </Hint>
      </div>
      <div className=" flex items-center h-full justify-center">
        <Hint label="stroke Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-color")}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "stroke-color" && "bg-gray-100")}
          >
            <div
              className=" rounded-sm size-4 border-2 bg-white"
              style={{
                borderColor: strokeColor,
              }}
            />
          </Button>
        </Hint>
      </div>

      <div className=" flex items-center h-full justify-center">
        <Hint label="Stroke Width" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-width")}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "stroke-width" && "bg-gray-100")}
          >
            <BsBorderWidth 
             className="size-4"
            />
          </Button>
        </Hint>
      </div>

      <div className=" flex items-center h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size={"icon"}
            variant={"ghost"}
          >
            <ArrowUp 
             className="size-4"
            />
          </Button>
        </Hint>
      </div>
      <div className=" flex items-center h-full justify-center">
        <Hint label="Send backward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackward()}
            size={"icon"}
            variant={"ghost"}
          >
            <ArrowDown 
             className="size-4"
            />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
