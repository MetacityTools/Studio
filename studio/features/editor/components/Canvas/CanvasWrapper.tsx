import * as GL from "@bananagl/bananagl";
import { GridModel } from "@editor/data/GridModel";
import { useDarkmode } from "@editor/hooks/useDarkmode";
import { useRenderer } from "@editor/hooks/useRender";
import { useScene } from "@editor/hooks/useScene";
import { useTooltip } from "@editor/hooks/useTooltip";
import React from "react";
import { Canvas } from "./Canvas";

export function CanvasWrapper() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const scene = useScene();
  const renderer = useRenderer();
  const darkmode = useDarkmode();
  const [_, setTooltip] = useTooltip();

  React.useEffect(() => {
    if (canvasRef.current && renderer) {
      GL.mountRenderer(canvasRef.current, renderer, {}, [
        {
          view: new GL.View(scene),
          size: {
            mode: "relative",
            width: 100,
            height: 100,
          },
          position: {
            mode: "relative",
            top: 0,
            left: 0,
          },
        },
      ]);

      const grid = new GridModel();
      scene.add(grid);

      if (darkmode) renderer.clearColor = [0.1, 0.1, 0.1, 1];
      else renderer.clearColor = [1, 1, 1, 1];

      const down = (e: KeyboardEvent) => {
        renderer.window.controls.keydown(e);
      };

      const up = (e: KeyboardEvent) => {
        renderer.window.controls.keyup(e);
      };

      document.addEventListener("keydown", down);
      document.addEventListener("keyup", up);

      return () => {
        document.removeEventListener("keydown", down);
        document.removeEventListener("keyup", up);
        GL.unmountRenderer(renderer);
      };
    }
  }, [renderer, scene]);

  const handleTooltip = (data: any, x: number, y: number) => {
    setTooltip({ data, x, y });
  };

  const handleHideTooltip = () => {
    setTooltip(null);
  };

  return (
    <Canvas
      canvasRef={canvasRef}
      onTooltip={handleTooltip}
      onHideTooltip={handleHideTooltip}
    />
  );
}
