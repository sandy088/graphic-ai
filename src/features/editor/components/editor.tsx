"use client";
import { fabric } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "../hooks/use-editor";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";
import { ActiveTool } from "../types";
import { ShapeSidebar } from "./shape-sidebar";

export const Editor = () => {
  const { init, editor } = useEditor();
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  //why need to use these 2 useRef?: To resize the canvas to the size of the workspace
  //and zoom in and out of the canvas smoothly
  //its is hard to do in canvas without useref
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        setActiveTool("select");
        return;
      }

      if (tool === "draw") {
        //TODO: Implement draw functionality
      }

      if (activeTool === "draw") {
        //TODO: Implement disable draw functionality
      }

      setActiveTool(tool);
    },
    [activeTool, setActiveTool]
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
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
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

        <main className=" bg-muted flex-1 relative overflow-auto  flex flex-col">
          <Toolbar />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
