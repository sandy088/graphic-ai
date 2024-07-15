import {fabric} from 'fabric';
import { useEffect } from 'react';

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

export const UseCanvasEvents = ({
  canvas,
  setSelectObjects,
  clearSelectionCallback,
}:
UseCanvasEventsProps
) => {
 
  useEffect(() => {
    if(canvas){
      canvas.on('selection:created',(e)=>{
        setSelectObjects(e.selected|| []);
      })

      canvas.on('selection:updated',(e)=>{
        setSelectObjects(e.selected|| []);
      })

      canvas.on('selection:cleared',()=>{
        setSelectObjects([]);
        clearSelectionCallback?.();
      })
    }
    return () => {
      if(canvas){
        canvas.off('selection:created');
        canvas.off('selection:updated');
        canvas.off('selection:cleared');
      }
    }
  },[canvas, setSelectObjects, clearSelectionCallback])
};
