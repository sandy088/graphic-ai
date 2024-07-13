"use client";
import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { useEditor } from "../hooks/use-editor";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";

export const Editor = () => {
  const { init } = useEditor();

  //why need to use these 2 useRef?: To resize the canvas to the size of the workspace
  //and zoom in and out of the canvas smoothly
  //its is hard to do in canvas without useref
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <Navbar />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar />
        <main className=" bg-muted flex-1 relative overflow-auto  flex flex-col">
          <Toolbar/>
          <div className="flex-1 h-[calc(100%-124px)] bg-muted" ref={containerRef}>
            <canvas ref={canvasRef} />
          </div>
          <Footer/>
        </main>
      </div>
    </div>
  );
};