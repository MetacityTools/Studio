"use client";

import * as GL from "@bananagl/bananagl";
import { EditorModel } from "@editor/data/EditorModel";
import { useRenderer } from "@editor/hooks/useRender";
import { useSelection } from "@editor/hooks/useSelection";
import { SelectionType } from "@editor/providers/EditorProvider";
import { RefObject, useEffect, useRef } from "react";

type SelectionArrayType = {
  object: GL.Pickable;
  primitiveIndices: number[];
}[];

type SelectionSingleType = {
  object: GL.Pickable;
  primitiveIndices: number;
};

type SelectionOutput = SelectionArrayType | SelectionSingleType;

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  onTooltip?: (meta: any, x: number, y: number) => void;
  onHideTooltip?: () => void;
}

export function Canvas(props: CanvasProps) {
  const renderer = useRenderer();
  const select = useSelection();
  const timerRef = useRef<NodeJS.Timeout>();

  function handlePick(selection: SelectionOutput, shiftKey: boolean) {
    const multiselect = Array.isArray(selection);
    const selectionObj = primitiveIndicesToSubmodelIndices(selection);
    let { toggle, extend } = selectionFlags(multiselect, shiftKey);
    select(selectionObj, toggle, extend);
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!props.onTooltip || !props.onHideTooltip) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    props.onHideTooltip!();
    timerRef.current = setTimeout(() => {
      const selection = renderer.controls?.pointerHover(event);
      if (!selection) return;
      const selectionObj = primitiveIndicesToSubmodelIndices(selection);
      const model = selectionObj.keys().next().value;
      const submodel = selectionObj.get(model)?.values().next().value;
      const metadata = model.metadata[submodel];

      if (!metadata) return;

      const { xpos, ypos } = getOffset(event);
      props.onTooltip!(metadata, xpos, ypos);
    }, 100);
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    const canvas = props.canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel);
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [props.canvasRef]);

  return (
    <canvas
      ref={props.canvasRef}
      key="canvas"
      tabIndex={1000}
      style={{
        width: "100%",
        height: "100%",
        outline: "none",
      }}
      onPointerDown={(e) => {
        renderer.controls?.pointerDown(e.nativeEvent);
      }}
      onPointerMove={(e) => {
        renderer.controls?.pointerMove(e.nativeEvent);
        handlePointerMove(e.nativeEvent);
      }}
      onPointerUp={(e) => {
        let selection = renderer.controls?.pointerUp(e.nativeEvent);
        const shift = renderer.controls?.keyboard.keyMap.shift ?? false;
        if (selection) handlePick(selection, shift);
        //else deselecteAll(); //TODO handle only if clicked, no drag and move
      }}
      onPointerLeave={(e) => {
        renderer.controls?.pointerOut(e.nativeEvent);
        handlePointerLeave(e.nativeEvent);
      }}
      onWheel={(e) => {
        renderer.controls?.wheel(e.nativeEvent);
      }}
      onPointerOut={(e) => {
        renderer.controls?.pointerOut(e.nativeEvent);
      }}
      onContextMenu={(e) => {
        renderer.controls?.contextMenu(e.nativeEvent);
      }}
    />
  );
}

function primitiveIndicesToSubmodelIndices(selection: SelectionOutput) {
  const selectedMap: SelectionType = new Map();

  const arrayedSelection = Array.isArray(selection)
    ? selection
    : [
        {
          object: selection.object,
          primitiveIndices: [selection.primitiveIndices],
        },
      ];

  for (const { object, primitiveIndices } of arrayedSelection) {
    const submodel = object.attributes.getAttribute("submodel") as GL.Attribute;
    const submodelIds = submodel.buffer.getView(Uint32Array);
    const submodelIDs = new Set<number>();
    for (const idx of primitiveIndices) submodelIDs.add(submodelIds[idx * 3]);
    selectedMap.set(object as EditorModel, submodelIDs);
  }

  return selectedMap;
}

function selectionFlags(multiselect: boolean, shiftKey: boolean) {
  let toggle = false;
  let extend = false;

  if (multiselect) {
    if (shiftKey) extend = true;
    else toggle = true;
  } else if (shiftKey) toggle = true;
  return { toggle, extend };
}

function getOffset(event: any) {
  const xpos: number = (!event.offsetX ? event.layerX! : event.offsetX) ?? 0;
  const ypos: number = (!event.offsetY ? event.layerY! : event.offsetY) ?? 0;
  return { xpos, ypos };
}
