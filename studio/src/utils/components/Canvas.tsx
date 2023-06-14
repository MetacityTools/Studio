import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { SelectionType } from './Context';
import { useRenderer, useSelection } from './hooks';

type SelectionArrayType = {
    object: GL.Pickable;
    primitiveIndices: number[];
}[];

type SelectionSingleType = {
    object: GL.Pickable;
    primitiveIndices: number;
};

type SelectionOutput = SelectionArrayType | SelectionSingleType;

function primitiveIndicesToSubmodelIndices(selection: SelectionArrayType) {
    const selectedMap: SelectionType = new Map();

    for (const { object, primitiveIndices } of selection) {
        const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
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

export function Canvas(props: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
    const renderer = useRenderer();
    const [select] = useSelection();

    function handlePick(selection: SelectionOutput, shiftKey: boolean) {
        const multiselect = Array.isArray(selection);
        const arrayedSelection = Array.isArray(selection)
            ? selection
            : [
                  {
                      object: selection.object,
                      primitiveIndices: [selection.primitiveIndices],
                  },
              ];
        const selectionObj = primitiveIndicesToSubmodelIndices(arrayedSelection);
        let { toggle, extend } = selectionFlags(multiselect, shiftKey);
        select(selectionObj, toggle, extend);
    }

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
    };

    React.useEffect(() => {
        const canvas = props.canvasRef.current;
        if (!canvas) return;
        canvas.addEventListener('wheel', handleWheel);
        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [props.canvasRef]);

    return (
        <canvas
            ref={props.canvasRef}
            key="canvas"
            tabIndex={1000}
            className="w-full h-full outline-none"
            onPointerDown={(e) => {
                renderer.controls?.pointerDown(e.nativeEvent);
            }}
            onPointerMove={(e) => {
                renderer.controls?.pointerMove(e.nativeEvent);
            }}
            onPointerUp={(e) => {
                let selection = renderer.controls?.pointerUp(e.nativeEvent);
                const shift = renderer.controls?.keyboard.keyMap.shift ?? false;
                if (selection) handlePick(selection, shift);
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
