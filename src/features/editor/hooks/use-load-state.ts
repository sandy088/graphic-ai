import { fabric } from "fabric";
import { useEffect, useRef } from "react";
import { JSON_KEYS } from "../types";

interface UseLoadProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.MutableRefObject<string | undefined>;
  canvasHistory: React.MutableRefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}
export const useLoadState = ({
  autoZoom,
  canvas,
  initialState,
  canvasHistory,
  setHistoryIndex,
}: UseLoadProps) => {
  //because we don't want to run this function twice
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && initialState?.current && canvas) {
      const data = JSON.parse(initialState.current);

      initialized.current = true;
      canvas?.loadFromJSON(data, () => {
        const currentState = JSON.stringify(canvas?.toJSON(JSON_KEYS));

        canvasHistory.current = [currentState];
        setHistoryIndex(0);
        autoZoom();
      });
      initialized.current = true;
    }
  }, [
    autoZoom,
    canvas,
    canvasHistory, // technically no need, because its a ref
    initialState, // technically no need, because its a ref
    setHistoryIndex, // technically no need, because its a dispatch
  ]);
};
