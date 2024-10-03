"use client";
import { ActiveTool, Editor, FONT_SIZE, FONT_WEIGHT } from "../types";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Lock,
  RectangleEllipsis,
  Scan,
  SquareSplitHorizontal,
  Trash,
  Unlock,
} from "lucide-react";
import { BsBorderWidth } from "react-icons/bs";
import { TbColorFilter } from "react-icons/tb";
import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "../utils";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import React, { useState } from "react";
import { FontSizeInput } from "./font-size-input";

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
  const intialFontLineThrough = editor?.getActiveLineThrough();
  const initalFontUnderline = editor?.getActiveFontUnderline();
  const initialTextAlign = editor?.getActiveTextAlign();
  const initialFontSize = editor?.getActiveFontSize() || FONT_SIZE;
  const getLockedObjects = editor?.getLockedObjects();
  const lineHeight = editor?.getTextLineHeight() || 1;

  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;
  const [properties, setProperties] = useState({
    fontWeight: initialFontWeight,
    fillColor: intialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontStyle: initialFontStyle,
    fontLineThrough: intialFontLineThrough,
    fontUnderline: initalFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
    isLocked: getLockedObjects || false,
    lineHeight: lineHeight,
  });

  const selectedObjectType = editor?.selectObjects[0]?.type;
  const selectedObject = editor?.selectObjects[0];

  const isImage = selectedObjectType === "image";

  // useEffect(() => {
  //   setProperties((current) => ({
  //     ...current,
  //     isLocked: getLockedObjects || false,
  //   }));
  // }, [getLockedObjects]);

  if (editor?.selectObjects.length === 0) {
    // return (
    //   <div className=" shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"></div>
    // );
    return <div
     className="h-[56px]"
    ></div>;
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

  const toggleLineThrough = () => {
    if (!selectedObject) return;
    const newValue = properties.fontLineThrough ? false : true;
    editor?.changeFontLineThrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLineThrough: newValue,
    }));
  };

  const toggleFontUnderline = () => {
    if (!selectedObject) return;
    const newValue = properties.fontUnderline ? false : true;
    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) return;
    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  const onChangeFontSize = (value: number) => {
    if (!selectedObject) return;
    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  return (
    <div className=" shrink-0 h-[56px] border-b bg-white w-full max-w-fit mx-auto shadow-sm rounded-md flex items-center justify-center overflow-x-auto z-[49] p-2 gap-x-2">
      {isImage && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Filters" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("filter")}
              size={"icon"}
              variant={"ghost"}
              className={cn(activeTool === "filter" && "bg-gray-100")}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isImage && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Remove Background" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("remove-bg")}
              size={"icon"}
              variant={"ghost"}
              className={cn(activeTool === "remove-bg" && "bg-gray-100")}
            >
              <SquareSplitHorizontal className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {!isImage && (
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
      )}

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
            <Hint
              label={
                selectedObjectType === "rect"
                  ? "Stroke Width | Corner radius"
                  : "Stroke width"
              }
              side="bottom"
              sideOffset={5}
            >
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

      {selectedObjectType === "rect" && (
        <div className=" flex items-center h-full justify-center">
          <Hint label={"Corner radius"} side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("stroke-width")}
              size={"icon"}
              variant={"ghost"}
              className={cn(activeTool === "stroke-width" && "bg-gray-100")}
            >
              <Scan className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <FontSizeInput
            value={properties.fontSize}
            onChange={onChangeFontSize}
          />
        </div>
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

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Underline" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleFontUnderline}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.fontUnderline && "bg-gray-100")}
            >
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Strike" side="bottom" sideOffset={5}>
            <Button
              onClick={toggleLineThrough}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.fontLineThrough && "bg-gray-100")}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Align left" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("left")}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.textAlign === "left" && "bg-gray-100")}
            >
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Align center" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("center")}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.textAlign === "center" && "bg-gray-100")}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Align right" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeTextAlign("right")}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.textAlign === "right" && "bg-gray-100")}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isTextType(selectedObjectType) && (
        <div className=" flex items-center h-full justify-center">
          <Hint label="Text Properties" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool("text-properties")}
              size={"icon"}
              variant={"ghost"}
              className={cn(properties.textAlign === "right" && "bg-gray-100")}
            >
              <RectangleEllipsis className="size-4" />
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

      <div className=" flex items-center h-full justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button
            onClick={editor?.deleteObjects}
            size={"icon"}
            variant={"ghost"}
          >
            <Trash className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className=" flex items-center h-full justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
            size={"icon"}
            variant={"ghost"}
          >
            <Copy className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className=" flex items-center h-full justify-center">
        <Hint
          label={properties.isLocked ? "Lock" : "UnLock"}
          side="bottom"
          sideOffset={5}
        >
          <Button
            onClick={() => {
              properties.isLocked
                ? editor?.lockObjects()
                : editor?.unlockObjects();

              setProperties((current) => ({
                ...current,
                isLocked: editor?.getLockedObjects() || false,
              }));
            }}
            size={"icon"}
            variant={"ghost"}
          >
            {properties.isLocked ? (
              <Lock className="size-4" />
            ) : (
              <Unlock className="size-4" />
            )}
          </Button>
        </Hint>
      </div>
    </div>
  );
};
