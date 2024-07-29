import { fabric } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "./use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  EditorHookProps,
  FILL_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_STYLE,
  FONT_WEIGHT,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
} from "../types";
import { UseCanvasEvents } from "./use-canvas-events";
import { isTextType } from "../utils";
import { ITextboxOptions } from "fabric/fabric-impl";

const bulkEditor = ({
  canvas,

  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectObjects,
  strokeDashArray,
  setStrokeDashArray,
  fontFamily,
  setFontFamily,
}: BuildEditorProps): Editor => {
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

    deleteObjects:()=>{
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },

    changeFontLineThrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          //Fabric.js does not have types for linethrough
          object.set({ linethrough: value });
        }
      });

      canvas.renderAll();
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          //Fabric.js does not have types for linethrough
          object.set({ underline: value });
        }
      });

      canvas.renderAll();
    },

    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          //Fabric.js does not have types for textAlign
          object.set({ textAlign: value });
        }
      });

      canvas.renderAll();
    },

    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          //Fabric.js does not have types for textAlign
          object.set({ fontSize: value });
        }
      });

      canvas.renderAll();
    },



    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          //Fabric.js does not have types for fontStyle
          object.set({ fontStyle: value });
        }
      });

      canvas.renderAll();
    },
    
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          //Fabric.js does not have types for fontWeight
          object.set({ fontWeight: value });
        }
      });

      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });

      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();

      //Because: Elements should not be able to go behind the workspace 👇👇
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas?.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object._set("fontFamily", value);
        }
      });
      canvas?.renderAll();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas?.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas?.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas?.getActiveObjects().forEach((object) => {
        //handling text types because they don't have the stroke
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });

      canvas?.renderAll();
    },

    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas?.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });

      canvas?.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas?.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });

      canvas?.renderAll();
    },
    addText: (value, options) => {
      const textObject = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
        // stroke: strokeColor,
        // strokeWidth: strokeWidth,
        // strokeDashArray: strokeDashArray,
      });
      addToCanvas(textObject);
    },
    addCircle: () => {
      const circle = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(circle);
    },
    addRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 40,
        ry: 40,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(rectangle);
    },

    addFullRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(rectangle);
    },

    addTriangle: () => {
      const triangle = new fabric.Triangle({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(triangle);
    },

    addRotatedTriangle: () => {
      const triangle = new fabric.Triangle({
        ...RECTANGLE_OPTIONS,
        angle: 180,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(triangle);
    },

    addDiamond: () => {
      const diamond = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 40,
        ry: 40,
        angle: 45,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(diamond);
    },
    canvas, //TODO: Change Position of this

    getActiveLineThrough: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return false;
      }
      // @ts-ignore
      //Fabric.js does not have types for linethrough
      const value = selectedObject.get("linethrough") || false;
      return value;
    },

    getActiveFontUnderline: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return false;
      }
      // @ts-ignore
      //Fabric.js does not have types for underline
      const value = selectedObject.get("underline") || false;
      return value;
    },
    getActiveTextAlign: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return "left";
      }
      // @ts-ignore
      //Fabric.js does not have types for textAlign
      const value = selectedObject.get("textAlign") || "left";
      return value;
    },

    getActiveFontSize: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return FONT_SIZE;
      }
      // @ts-ignore
      //Fabric.js does not have types for fontSize
      const value = selectedObject.get("fontSize") || FONT_SIZE;
      return value;
    },
    getActiveFontFamily: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return fontFamily;
      }
      // @ts-ignore
      //Fabric.js does not have types for fontFamily
      const value = selectedObject.get("fontFamily") || fontFamily;
      return value;
    },

    getActiveFontStyle: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return FONT_STYLE;
      }
      // @ts-ignore
      //Fabric.js does not have types for fontStyle
      const value = selectedObject.get("fontStyle") || FONT_STYLE;
      return value;
    },

    getActiveFontWeight: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return FONT_WEIGHT;
      }
      // @ts-ignore
      //Fabric.js does not have types for fontWeight
      const value = selectedObject.get("fontWeight") || FONT_WEIGHT;
      return value;
    },

    getActiveOpacity: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return 1;
      }
      return selectedObject.get("opacity") || 1;
    },

    getActiveFillColor: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return fillColor;
      }
      const value = selectedObject.get("fill") || fillColor;

      // Currently gradients and patterns are not supported thats why I have did this
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return strokeColor;
      }
      const value = selectedObject.get("stroke") || strokeColor;

      // Currently gradients and patterns are not supported thats why I have did this
      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return strokeWidth;
      }
      const value = selectedObject.get("strokeWidth") || strokeWidth;

      // Currently gradients and patterns are not supported thats why I have did this
      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return strokeDashArray;
      }
      const value = selectedObject.get("strokeDashArray") || strokeDashArray;

      // Currently gradients and patterns are not supported thats why I have did this
      return value;
    },
    selectObjects,
  };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectObjects, setSelectObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  useAutoResize({
    canvas,
    container,
  });

  UseCanvasEvents({
    canvas,
    setSelectObjects,
    clearSelectionCallback,
  });
  const editor = useMemo(() => {
    if (canvas) {
      return bulkEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectObjects,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
      });
    }

    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectObjects,
    strokeDashArray,
    fontFamily,
  ]);

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
