"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { Editor } from "../types";

interface FooterProps {
  editor: Editor | undefined;
}
export const Footer = ({ editor }: FooterProps) => {
  return (
    <footer className="h-[52px] border-t bg-white w-full flex items-center justify-between overflow-x-auto z-[49 p-2 gap-x-1 shrink-0 px-4 flex-row-reverse]">
      <div>
        <Hint label="Zoom in" side="top" sideOffset={10}>
          <Button
            onClick={editor?.zoomIn}
            size={"icon"}
            variant={"ghost"}
            className="h-full"
          >
            <ZoomIn className=" size-4" />
          </Button>
        </Hint>

        <Hint label="Zoom out" side="top" sideOffset={10}>
          <Button
            onClick={editor?.zoomOut}
            size={"icon"}
            variant={"ghost"}
            className="h-full"
          >
            <ZoomOut className=" size-4" />
          </Button>
        </Hint>

        <Hint label="Reset" side="top" sideOffset={10}>
          <Button
            onClick={editor?.autoZoom}
            size={"icon"}
            variant={"ghost"}
            className="h-full"
          >
            <Minimize className=" size-4" />
          </Button>
        </Hint>
      </div>
      <div className=" mr-3">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-lg">⌘</span>+ S: Save
        </kbd>
      </div>
    </footer>
  );
};
