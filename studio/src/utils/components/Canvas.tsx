import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '../../components/Editor/Context/EditorContext';

function primitiveIndicesToSubmodelIndices(object: EditorModel, indices: number[]) {
    const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
    const submodelIds = submodel.buffer.getView(Uint32Array);
    const submodelIDs = new Set<number>();
    for (const idx of indices) submodelIDs.add(submodelIds[idx * 3]);
    return Array.from(submodelIDs);
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
    const { renderer, select } = React.useContext(EditorContext);

    function handlePick(object: EditorModel, indices: number | number[], shiftKey: boolean) {
        const multiselect = Array.isArray(indices);
        const arrIdxs = multiselect ? indices : [indices];
        const submodelIDs = primitiveIndicesToSubmodelIndices(object, arrIdxs);
        let { toggle, extend } = selectionFlags(multiselect, shiftKey);
        select(object as EditorModel, submodelIDs, toggle, extend);
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
                const selection = renderer.controls?.pointerUp(e.nativeEvent);
                const shift = renderer.controls?.keyboard.keyMap.shift ?? false;
                if (selection)
                    handlePick(selection.object as EditorModel, selection.primitiveIndices, shift);
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
