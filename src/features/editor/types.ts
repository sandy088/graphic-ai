import { fabric } from "fabric";
import { ITextboxOptions } from "fabric/fabric-impl";
import * as material from "material-colors";

export interface EditorHookProps {
  defaultState: string;
  defaultHeight: number;
  defaultWidth: number;
  clearSelectionCallback?: () => void;
  saveCallback?: (values: {
    json: string;
    height: number;
    width: number;
  }) => void;
}

export const seelectionDependantTools = [
  "fill",
  "stroke-color",
  "stroke-width",
  "font",
  "opacity",
  "filter",
  "remove-bg",
  "text-properties",
];

export type ActiveTool =
  | "select"
  | "images"
  | "text"
  | "shapes"
  | "ai"
  | "settings"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "remove-bg"
  | "templates"
  | "text-properties";

export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 1;
export const STROKE_DASH_ARRAY = [];
export const FONT_WEIGHT = 400;
export const FONT_STYLE = "normal";

export const CIRCLE_OPTIONS = {
  radius: 50,
  fill: FILL_COLOR,
  height: 100,
  width: 100,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  height: 400,
  width: 400,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  angle: 0,
};

export const TEXT_OPTIONS = {
  type: "textbox",
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
};

export const TRIANGLE_OPTIONS = {
  fill: FILL_COLOR,
  height: 400,
  width: 400,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export type BuildEditorProps = {
  save: (skip?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  autoZoom: () => void;
  copy: () => void;
  paste: () => void;
  canvas: fabric.Canvas;
  fillColor: string;
  setFillColor: (value: string) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  selectObjects: fabric.Object[];
  strokeDashArray: number[];
  setStrokeDashArray: (value: number[]) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
};

export interface Editor {
  savePng: () => void;
  saveJson: () => void;
  saveSvg: () => void;
  saveJpeg: () => void;
  loadFromJson: (json: string) => void;
  autoZoom: () => void;
  getWorkspace: () => fabric.Object | undefined;
  zoomIn: () => void;
  zoomOut: () => void;
  changeSize: (value: { width: number; height: number }) => void;
  changeBackgroundColor: (color: string) => void;
  enableDrawingMode: () => void;
  disableDrawingMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  onCopy: () => void;
  onPaste: () => void;
  addVideo: (url: string) => void;
  addImage: (url: string) => void;
  deleteObjects: () => void;
  lockObjects: () => void;
  unlockObjects: () => void;
  getLockedObjects: () => boolean;
  changeImageFilter: (filter: string) => void;
  changeFontSize: (value: number) => void;
  changeTextLineHeight: (value: number) => void;
  getTextLineHeight: () => number;
  changeLetterSpacing: (value: number) => void;
  getLetterSpacing: () => number;
  changeRadius: (value: number) => void;
  getRadius: () => number;
  changeFontLineThrough: (value: boolean) => void;
  changeFontUnderline: (value: boolean) => void;
  changeTextAlign: (value: string) => void;
  changeFontStyle: (value: string) => void;
  changeFontWeight: (value: number) => void;
  changeOpacity: (value: number) => void;
  bringForward: () => void;
  sendBackward: () => void;
  changeFontFamily: (value: string) => void;
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeDashArray: (value: number[]) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  addCircle: () => void;
  addRectangle: () => void;
  addFullRectangle: () => void;
  addTriangle: () => void;
  addRotatedTriangle: () => void;
  addDiamond: () => void;
  getActiveImageFilters: () => string[];
  getActiveFontSize: () => number;
  getActiveLineThrough: () => boolean;
  getActiveFontUnderline: () => boolean;
  getActiveTextAlign: () => string;
  getActiveFontStyle: () => string;
  getActiveFontWeight: () => number;
  getActiveFontFamily: () => string;
  getActiveFillColor: () => string;
  getActiveOpacity: () => number;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];
  canvas: fabric.Canvas;
  selectObjects: fabric.Object[];
}

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];

//These fonts should be supported by the browser
//TODO: Add more fonts
export const fonts = [
  "Arial",
  "Arial Black",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Courier New",
  "Brush Script MT",
  "Comic Sans MS",
  "Palatino",
  "Bookman",
  "Impact",
  "Lucida Console",
  "Geneva",
];

export const filters = [
  "none",
  "polaroid",
  "sepia",
  "kodachrome",
  "contrast",
  "brightness",
  "grayscale",
  "brownie",
  "vintage",
  "technicolor",
  "pixelate",
  "invert",
  "blur",
  "sharpen",
  "emboss",
  "removecolor",
  "blacknwhite",
  "vibrance",
  "blendcolor",
  "huerotate",
  "resize",
  "saturation",
  "gamma",
];

export const JSON_KEYS = [
  "name",
  "gradientAngle",
  "selectable",
  "hasControls",
  "linkData",
  "editable",
  "extensionType",
  "extension",
];
