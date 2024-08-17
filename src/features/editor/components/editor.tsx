"use client";
import { fabric } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useEditor } from "../hooks/use-editor";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";
import { ActiveTool, seelectionDependantTools } from "../types";
import { ShapeSidebar } from "./shape-sidebar";
import { FillColorSidebar } from "./fill-color-sidebar";
import { StrokeColorSidebar } from "./stroke-color-sidebar";
import { StrokeOptionsSidebar } from "./stroke-width-sidebar";
import { OpacitySidebar } from "./opacity-sidebar";
import { TextSidebar } from "./text-sidebar";
import { FontSidebar } from "./font-sidebar";
import { ImageSidebar } from "./image-sidebar";
import { ImageFilterSidebar } from "./image-filters-sidebar";
import { AiSidebar } from "./ai-sidebar";
import { RemoveBgSidebar } from "./remove-bg-sidebar";
import { DrawSidebar } from "./draw-sidebar";
import { SettingsSidebar } from "./settings-sidebar";
import { ResponseType } from "@/features/projects/api/use-get-project";
import { useSaveProject } from "@/features/projects/api/use-save-project";
import { TemplatesSidebar } from "./templates-sidebar";
import { TextPropertiesSidebar } from "./text-properties-sidebar";

interface EditorProps {
  initialData: ResponseType["data"];
  isAi: string;
}
export const Editor = ({ isAi, initialData }: EditorProps) => {
  const { mutate } = useSaveProject(initialData.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((values: { json: string; height: number; width: number }) => {
      //TODO: add debounce
      mutate(values);
    }, 1500),
    [mutate]
  );

  const initialActiveTool = isAi === "true" ? "ai" : "select";
  const [activeTool, setActiveTool] = useState<ActiveTool>(initialActiveTool);
  //why need to use these 2 useRef?: To resize the canvas to the size of the workspace
  //and zoom in and out of the canvas smoothly
  //its is hard to do in canvas without useref
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //close color selection sidebar when no element is selected
  const onClearSelection = useCallback(() => {
    if (seelectionDependantTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);

  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultHeight: initialData.height,
    defaultWidth: initialData.width,
    clearSelectionCallback: onClearSelection,
    saveCallback: debouncedSave,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === "draw") {
        editor?.enableDrawingMode();
      }

      if (activeTool === "draw") {
        editor?.disableDrawingMode();
      }
      if (tool === activeTool) {
        setActiveTool("select");
        return;
      }

      setActiveTool(tool);
    },
    [activeTool, editor]
  );

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({
      intialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);
  return (
    <div className=" h-full flex flex-col">
      <Navbar
        id={initialData.id}
        projectTitle={initialData?.name}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextPropertiesSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeOptionsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <ImageFilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <AiSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <RemoveBgSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <DrawSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <TemplatesSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <main className=" bg-muted flex-1 relative overflow-auto  flex flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas?.getActiveObject())}
          />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};
