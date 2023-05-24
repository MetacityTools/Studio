import React from 'react';

import { EditorModel } from '@utils/models/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '../Context';

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
    const ctx = React.useContext(EditorContext);

    function handlePick(object: EditorModel, indices: number | number[], shiftKey: boolean) {
        const multiselect = Array.isArray(indices);
        const arrIdxs = multiselect ? indices : [indices];
        const submodelIDs = primitiveIndicesToSubmodelIndices(object, arrIdxs);
        let { toggle, extend } = selectionFlags(multiselect, shiftKey);
        ctx.select(object as EditorModel, submodelIDs, toggle, extend);
    }

    return (
        <canvas
            ref={props.canvasRef}
            key="canvas"
            tabIndex={1000}
            style={{
                width: '100%',
                height: '100%',
                outline: 'none',
            }}
            onPointerDown={(e) => {
                ctx.renderer.windowNullable?.controls?.pointerDown(e.nativeEvent);
            }}
            onPointerMove={(e) => {
                ctx.renderer.windowNullable?.controls?.pointerMove(e.nativeEvent);
            }}
            onPointerUp={(e) => {
                const selection = ctx.renderer.windowNullable?.controls?.pointerUp(e.nativeEvent);
                const shift = ctx.renderer.windowNullable?.controls?.keyboard.keyMap.shift ?? false;
                if (selection)
                    handlePick(selection.object as EditorModel, selection.primitiveIndices, shift);
            }}
            onWheel={(e) => {
                ctx.renderer.windowNullable?.controls?.wheel(e.nativeEvent);
            }}
            onPointerOut={(e) => {
                ctx.renderer.windowNullable?.controls?.pointerOut(e.nativeEvent);
            }}
            onContextMenu={(e) => {
                ctx.renderer.windowNullable?.controls?.contextMenu(e.nativeEvent);
            }}
        />
    );
}
