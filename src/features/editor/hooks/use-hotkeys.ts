import { fabric } from "fabric";
import { useEvent, useMouseWheel } from "react-use";
import { Editor } from "../types";

interface UseHotKeysProps {
  editor: Editor | undefined;
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  copy: () => void;
  paste: () => void;
  save: (skip?: boolean) => void;
}
export const useHotKeys = ({
  editor,
  canvas,
  undo,
  redo,
  copy,
  paste,
  save,
}: UseHotKeysProps) => {
  useEvent("keydown", (e) => {
    const isCtrlKey = e.ctrlKey || e.metaKey;
    const isBackspace = e.key === "Backspace";
    const isDeleteKey = e.key === "Delete";
    const isInput = ["INPUT", "TEXTAREA"].includes(
      (e.target as HTMLElement).tagName
    );

    if (isInput) return;

    //TODO add Delete key as well
    if (isBackspace || isDeleteKey) {
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
    }

    if (isCtrlKey && e.key === "z") {
      e.preventDefault();
      undo();
    }

    if (isCtrlKey && e.key === "y") {
      e.preventDefault();
      redo();
    }

    if (isCtrlKey && e.key === "c") {
      e.preventDefault();
      copy();
    }

    if (isCtrlKey && e.key === "v") {
      e.preventDefault();
      paste();
    }

    if (isCtrlKey && e.key === "s") {
      e.preventDefault();
      //save to database only
      save(true);
    }

    if (isCtrlKey && e.key === "a") {
      e.preventDefault();
      canvas?.discardActiveObject();

      const allObjects = canvas?.getObjects().filter((obj) => obj.selectable);
      canvas?.setActiveObject(
        new fabric.ActiveSelection(allObjects, { canvas })
      );
      canvas?.renderAll();
    }

    //zoom in ctrl key and + key
    if (isCtrlKey && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      editor?.zoomIn();
    }

    //zoom out ctrl key and - key
    if (isCtrlKey && e.key === "-") {
      e.preventDefault();
      editor?.zoomOut();
    }

    // ctrl + shift + L to Lock selected objects
    if (isCtrlKey  && e.key === "l") {
      e.preventDefault();
      editor?.lockObjects();
    }

    // ctrl + shift + U to Unlock selected objects
    if (isCtrlKey && e.key === "u") {
      e.preventDefault();
      editor?.unlockObjects();
    }
  });
};
