import { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  save: () => void;
  setSelectObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

export const UseCanvasEvents = ({
  canvas,
  save,
  setSelectObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", () => {
        save();
      });
      canvas.on("object:modified", () => {
        save();
      });
      canvas.on("object:removed", () => {
        save();
      });

      canvas.on("selection:created", (e) => {
        setSelectObjects(e.selected || []);
      });

      canvas.on("selection:updated", (e) => {
        setSelectObjects(e.selected || []);
      });

      canvas.on("selection:cleared", () => {
        setSelectObjects([]);
        clearSelectionCallback?.();
      });
    }
    return () => {
      if (canvas) {
        canvas.off("object:added");
        canvas.off("object:modified");
        canvas.off("object:removed");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  }, [save, canvas, setSelectObjects, clearSelectionCallback]);
};
