"use client";
import { ActiveTool, Editor, FONT_WEIGHT } from "../types";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "../utils";
import { FaBold, FaItalic } from "react-icons/fa";
import { useState } from "react";

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
  const intialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontStyle = editor?.getActiveFontStyle();

  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const [properties, setProperties] = useState({
    fontWeight: initialFontWeight,
    fillColor: intialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontStyle: initialFontStyle,
  });

  const selectedObjectType = editor?.selectObjects[0]?.type;
  const selectedObject = editor?.selectObjects[0];

  if (editor?.selectObjects.length === 0) {
    return (
      <div className=" shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"></div>
    );
  }

  const toggleBold = () => {
    if (!selectedObject) return;
    const newValue = properties.fontWeight > 500 ? 400 : 700;
    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      fontWeight: newValue,
    }));
  };

  const toggleITalic = () => {
    if (!selectedObject) return;
    const newValue = properties.fontStyle === "italic" ? "normal" : "italic";
    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };

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
                backgroundColor: properties.fillColor,
              }}
            />
          </Button>
        </Hint>
      </div>

      {!isTextType(selectedObjectType) && (
        <>
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
                    borderColor: properties.strokeColor,
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
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
        </>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size={"icon"}
              variant={"ghost"}
              className={cn(
                "w-auto px-2 text-sm",
                activeTool === "font" && "bg-gray-100"
              )}
            >
              <div className=" max-w-[100px] truncate">
                {properties.fontFamily || "Arial"}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Bold" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleBold}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.fontWeight > 500 && "bg-gray-100")}
            >
              <FaBold className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Italic" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleITalic}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
            >
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      <div className=" flex items-center h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size={"icon"}
            variant={"ghost"}
          >
            <ArrowUp className="size-4" />
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
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className=" flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size={"icon"}
            variant={"ghost"}
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};
