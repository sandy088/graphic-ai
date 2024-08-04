import { fabric } from "fabric";
import { useCallback, useEffect } from "react";
interface UseAutoResizeProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
}
export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) {
      return;
    }

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const center = canvas.getCenter();
    const zoomRatio = 0.85;

    const localWorkSpace = canvas
      .getObjects()
      .find((object) => object.name === "clip");

    //@ts-ignore
    const scale = fabric.util.findScaleToFit(localWorkSpace, {
      width: width,
      height: height,
    });

    const zoom = zoomRatio * scale;

    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

    if (!localWorkSpace) {
      return;
    }

    const workSpaceCenter = localWorkSpace.getCenterPoint();
    const viewPortTransform = canvas.viewportTransform;

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewPortTransform
    ) {
      return;
    }

    viewPortTransform[4] =
      canvas.width / 2 - workSpaceCenter.x * viewPortTransform[0];
    viewPortTransform[5] =
      canvas.height / 2 - workSpaceCenter.y * viewPortTransform[3];

    canvas.setViewportTransform(viewPortTransform);
    localWorkSpace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        console.log("resize");
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);
  return { autoZoom };
};
