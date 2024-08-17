import { fabric } from "fabric";
import { useCallback, useMemo, useRef, useState } from "react";
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
  JSON_KEYS,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
} from "../types";
import { UseCanvasEvents } from "./use-canvas-events";
import {
  createFilter,
  downloadFile,
  isTextType,
  transformText,
} from "../utils";
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./use-history";
import { useHotKeys } from "./use-hotkeys";
import { useWindow } from "./use-window";
import { useLoadState } from "./use-load-state";

const bulkEditor = ({
  save,
  undo,
  redo,
  canUndo,
  canRedo,
  autoZoom,
  copy,
  paste,
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
  const generateSaveOptions = () => {
    const { width, height, left, top } = getWorkspace() as fabric.Rect;

    return {
      name: "Image",
      format: "png",
      quality: 1,
      left: left,
      top: top,
      width: width,
      height: height,
    };
  };

  const savePng = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "png");
    autoZoom();
  };

  const saveSvg = () => {
    const options = generateSaveOptions();
    const options2 = {
      name: "Image",
      format: "svg",
      quality: 1,
      left: options.left,
      top: options.top,
      width: options.width,
      height: options.height,
    };
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toSVG(options2);
    downloadFile(dataUrl, "svg");
    autoZoom();
  };

  //save jpeg
  const saveJpeg = () => {
    const options = generateSaveOptions();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl = canvas.toDataURL(options);
    downloadFile(dataUrl, "jpeg");
    autoZoom();
  };

  //save json
  const saveJson = async () => {
    const dataUrl = canvas.toJSON(JSON_KEYS);
    // downloadFile(dataUrl, "json");
    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, "\t")
    )}`;

    downloadFile(fileString, "json");
  };

  const loadFromJson = (json: string) => {
    canvas.loadFromJSON(JSON.parse(json), () => {
      autoZoom();
    });
  };

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
    autoZoom,
    savePng,
    saveSvg,
    saveJpeg,
    saveJson,
    loadFromJson,
    getWorkspace: () => getWorkspace(),
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;

      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        //Suggestion: can remove zoom limit
        zoomRatio > 2.5 ? 2.5 : zoomRatio
      );
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;

      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio
      );
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();
      if (!workspace) {
        return;
      }
      workspace.set(value);
      autoZoom();
      //save to history
      save();
    },

    changeBackgroundColor: (value: string) => {
      const workspace = getWorkspace();
      if (!workspace) {
        return;
      }
      workspace.set({ fill: value });
      canvas?.renderAll();
      // Save to history
      save(false);
    },

    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onUndo: () => undo(),
    onRedo: () => redo(),
    canUndo: () => canUndo(),
    canRedo: () => canRedo(),
    onCopy: () => copy(),
    onPaste: () => paste(),
    changeImageFilter: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;
          const effect = createFilter(value);
          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });

      canvas.renderAll();
    },
        addVideo: (value: string) => {
          //create video element to the dom and then add element to canvas
    //       const video = document.createElement("video");
    //       video.src = value;
    //       video.autoplay = true;
    //       video.loop = true;
    //       video.muted = true;
    //       video.crossOrigin = "anonymous";
    //       video.play();
    //       const videoObject = new fabric.Image(video, {
    //         left: 0,
    //         top: 0,
    //         width: 100,
    //         height: 100,
    //       });

    //       var video1El = document.getElementById("video1");

    // var videoEL = new fabric.Image(video, {
    //   width: 960,
    //   height: 540
    // });
    //       addToCanvas(videoEL);
    //       fabric.util.requestAnimFrame(function render() {
    //         canvas.renderAll();
    //         fabric.util.requestAnimFrame(render);
    //       });




    const videoElement = document.createElement('video');
    videoElement.src = value; // Set the path to your video file
    videoElement.crossOrigin = 'anonymous'; // Important for loading videos across different domains
    videoElement.loop = true;
    videoElement.play();

    const fabricVideo = new fabric.Image(videoElement, {
      left: 100,
      top: 100,
      scaleX: 0.5,
      scaleY: 0.5,
      objectCaching: false, // Disable caching to allow video playback
      crossOrigin: 'anonymous',
    });

   
    addToCanvas(fabricVideo);

    // Update the canvas to redraw the video frame
    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });

        },
    addImage: (value: string) => {
      fabric.Image.fromURL(
        value,
        (img) => {
          const workspace = getWorkspace();
          img.scaleToWidth(workspace?.width || 0);
          img.scaleToHeight(workspace?.height || 0);
          addToCanvas(img);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    },

    deleteObjects: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    },

    lockObjects: () => {
      canvas.getActiveObjects().forEach((object) => {
        object.lockMovementX = true;
        object.lockMovementY = true;
        object.lockScalingX = true;
        object.lockScalingY = true;
        object.lockRotation = true;
      });

      canvas.renderAll();
    },

    unlockObjects: () => {
      canvas.getActiveObjects().forEach((object) => {
        object.lockMovementX = false;
        object.lockMovementY = false;
        object.lockScalingX = false;
        object.lockScalingY = false;
        object.lockRotation = false;
      });

      canvas.renderAll();
    },

    getLockedObjects: () => {
      const lockedObjects = canvas.getActiveObjects().filter((object) => !object.lockMovementX);
      if(lockedObjects.length === 0){
        return false;
      }else{
        return true;
      }

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
    changeTextLineHeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          object.set({ lineHeight: value });
        }
      });

      canvas.renderAll();
    },
    getTextLineHeight: () => {
      let lineHeight = 0;
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          //@ts-ignore
          lineHeight = object.get("lineHeight") || 1;
      }})
      return lineHeight;
    },

    changeLetterSpacing: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          object.set({ charSpacing: value });
        }
      });

      canvas.renderAll();
    },

    getLetterSpacing: () => {
      let letterSpacing = 0;
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          letterSpacing = object.get("charSpacing") || 0;
        }
      });
      return letterSpacing;
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
      canvas.freeDrawingBrush.color = value;
      canvas?.renderAll();
    },

    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas?.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });

      canvas.freeDrawingBrush.width = value;

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

    getActiveImageFilters: () => {
      const selectedObject = selectObjects[0];
      if (!selectedObject) {
        return [];
      }

      // @ts-ignore
      const value = selectedObject.get("filters") || [];
      return value;
    },
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

export const useEditor = ({
  defaultState,
  defaultHeight,
  defaultWidth,
  clearSelectionCallback,
  saveCallback,
}: EditorHookProps) => {
  //used this because we don't want to re-render the component whenever data saved in backend DB
  const initialState = useRef(defaultState);
  const initialHeight = useRef(defaultHeight);
  const initialWidth = useRef(defaultWidth);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectObjects, setSelectObjects] = useState<fabric.Object[]>([]);

  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  //custom functionality hooks
  const { copy, paste } = useClipboard({ canvas });
  const { save, undo, redo, canUndo, canRedo, canvasHistory, setHistoryIndex } =
    useHistory({ canvas, saveCallback });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  UseCanvasEvents({
    canvas,
    save,
    setSelectObjects,
    clearSelectionCallback,
  });

  //So important hook, make sure everything correct in it
  useLoadState({
    autoZoom,
    canvas,
    initialState,
    canvasHistory,
    setHistoryIndex,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return bulkEditor({
        save,
        undo,
        redo,
        canUndo,
        canRedo,
        autoZoom,
        copy,
        paste,
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
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    autoZoom,
    copy,
    paste,
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectObjects,
    strokeDashArray,
    fontFamily,
  ]);

  useHotKeys({
    editor,
    canvas,
    undo,
    redo,
    copy,
    paste,
    save,
  });

  useWindow();

  const init = useCallback(
    ({
      intialCanvas,
      initialContainer,
    }: {
      intialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      const initialWorkspace = new fabric.Rect({
        width: initialWidth.current,
        height: initialHeight.current,
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

      const currentState = JSON.stringify(intialCanvas.toJSON(JSON_KEYS));
      canvasHistory.current.push(currentState);
      setHistoryIndex(0);
    },
    [
      canvasHistory, //Actually No need, this is from useRef
      setHistoryIndex, //Actually No need, this is from useState
    ]
  );
  return { init, editor };
};
