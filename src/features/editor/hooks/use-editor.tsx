
import { fabric} from "fabric";
import { useCallback, useState } from "react";
import { useAutoResize } from "./use-auto-resize";

export const useEditor = () => {
    const[canvas, setCanvas] = useState< fabric.Canvas |null >(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    
    useAutoResize({
      canvas,
      container,
    });

  const init = useCallback(({
    intialCanvas,
    initialContainer,
  }:{
    intialCanvas: fabric.Canvas;
    initialContainer: HTMLDivElement;
  }) => {
    const initialWorkspace = new fabric.Rect({
        width:900,
        height:600,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.8)",
            blur: 5,
        })
    });
    intialCanvas.setWidth(initialContainer.offsetWidth);
    intialCanvas.setHeight(initialContainer.offsetHeight);
    intialCanvas.add(initialWorkspace);
    intialCanvas.centerObject(initialWorkspace);
    //This is because anything outside the workspace (White box centered - working space) will be clipped 
    intialCanvas.clipPath = initialWorkspace;
    setCanvas(intialCanvas);
    setContainer(initialContainer);
    
    const testBox = new fabric.Rect({
        width: 100,
        height: 100,
        fill: "black",
    });

    intialCanvas.add(testBox);
    intialCanvas.centerObject(testBox);
  },[]);
  return { init };
};
