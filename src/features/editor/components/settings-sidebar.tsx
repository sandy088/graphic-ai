import { cn } from "@/lib/utils";
import { ActiveTool, Editor, FILL_COLOR } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./color-picker";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SettingsSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  const workspace = editor?.getWorkspace();

  const initialWidth = useMemo(() => `${workspace?.width ?? 0}`, [workspace]);
  const initialHeight = useMemo(() => `${workspace?.height ?? 0}`, [workspace]);
  const initialBackground = useMemo(
    () => workspace?.fill ?? "#ffff",
    [workspace]
  );

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [backgroundColor, setBackgroundColor] = useState(initialBackground);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChangeWidth = (value: string) => setWidth(value);
  const onChangeHeight = (value: string) => setHeight(value);
  const onChangeBackgroundColor = (value: string) => {
    setBackgroundColor(value);
    editor?.changeBackgroundColor(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackgroundColor(initialBackground);
  }, [initialWidth, initialHeight, initialBackground]);
  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "settings" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader
        title="Settings"
        description="Modify the workspace settings"
      />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Height</Label>
            <Input
              placeholder="Height"
              value={height}
              type="number"
              onChange={(e) => onChangeHeight(e.target.value)}
            />

            <Label>Width</Label>
            <Input
              placeholder="Width"
              value={width}
              type="number"
              onChange={(e) => onChangeWidth(e.target.value)}
            />

            
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Resize
          </Button>
        </form>
        <div className=" p-4">
            <ColorPicker
                value={backgroundColor as string}
                onChange={onChangeBackgroundColor}
            />
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};
