import { cn } from "@/lib/utils";
import { ActiveTool, Editor } from "../types";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSideBarClose } from "./tool-sidebar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useEffect, useMemo, useState } from "react";

interface OpacitySidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: OpacitySidebarProps) => {
  const initialValue = editor?.getActiveOpacity() || 1;
  const selectedObject = useMemo(()=>editor?.selectObjects[0],[
    editor?.selectObjects
  ])
  const [opacity, setOpacity] = useState(initialValue);

  useEffect(()=>{
    if(selectedObject){
        setOpacity(selectedObject.get('opacity') || 1)
    }
  },[selectedObject])

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onChange = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value);
  };

  return (
    <aside
      className={cn(
        "py-3 pr-3 bg-muted",
        activeTool === "opacity" ? "visible" : "hidden"
      )}
    >
      <div
        className="bg-white relative border-r z-[40] w-[360px] rounded-md h-full flex flex-col"
      >

      
      <ToolSidebarHeader
        title="Adjust Opacity"
        description="Change the opacity of your element"
      />
      <ScrollArea>
        <div className=" p-4 space-y-4 border-b">
          <Slider
            value={[opacity]}
            onValueChange={(values) => onChange(values[0])}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} /></div>
    </aside>
  );
};
