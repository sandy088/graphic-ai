import { fabric } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "./use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  RECTANGLE_OPTIONS,
} from "../types";

const bulkEditor = ({ canvas }: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas?.getObjects().find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) {
      return;
    }

    //@ts-ignore
    canvas?._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas?.add(object);
    canvas?.setActiveObject(object);
  };
  return {
    addCircle: () => {
      const circle = new fabric.Circle({
        ...CIRCLE_OPTIONS,
      });
      addToCanvas(circle);
    },
    addRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 40,
        ry: 40,
      });
      addToCanvas(rectangle);
    },

    addFullRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
      });
      addToCanvas(rectangle);
    },

    addTriangle: () => {
      const triangle = new fabric.Triangle({
        ...RECTANGLE_OPTIONS,
      });
      addToCanvas(triangle);
    },

    addRotatedTriangle: () => {
      const triangle = new fabric.Triangle({
        ...RECTANGLE_OPTIONS,
        angle: 180,
      });
      addToCanvas(triangle);
    },

    addDiamond: ()=>{
      const diamond = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 40,
        ry: 40,
        angle: 45,
      });
      addToCanvas(diamond);
    }
  };
};
export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({
    canvas,
    container,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return bulkEditor({ canvas });
    }

    return undefined;
  }, [canvas]);

  const init = useCallback(
    ({
      intialCanvas,
      initialContainer,
    }: {
      intialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 600,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });
      intialCanvas.setWidth(initialContainer.offsetWidth);
      intialCanvas.setHeight(initialContainer.offsetHeight);
      intialCanvas.add(initialWorkspace);
      intialCanvas.centerObject(initialWorkspace);
      //This is because anything outside the workspace (White box centered - working space) will be clipped
      intialCanvas.clipPath = initialWorkspace;
      setCanvas(intialCanvas);
      setContainer(initialContainer);
    },
    []
  );
  return { init, editor };
};
