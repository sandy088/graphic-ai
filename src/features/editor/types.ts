import { fabric } from "fabric";
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
  | "templates";

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 1;

export const CIRCLE_OPTIONS = {
  radius: 50,
  fill: FILL_COLOR,
  height: 100,
  width: 100,
  stroke:STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
}

export const RECTANGLE_OPTIONS = {
  left:100,
  top:100,
  fill: FILL_COLOR,
  height: 400,
  width: 400,
  stroke:STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  fill: FILL_COLOR,
  height: 400,
  width: 400,
  stroke:STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
}

export type BuildEditorProps = {
  canvas: fabric.Canvas;
}

export interface Editor {
  addCircle: () => void;
  addRectangle: () => void;
  addFullRectangle: () => void;
  addTriangle: () => void;
  addRotatedTriangle: () => void;
  addDiamond: () => void;
}