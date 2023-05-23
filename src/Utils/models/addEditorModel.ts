import { vec3 } from 'gl-matrix';

import { ModelData, PrimitiveType } from '@utils/types';

import * as GL from '@bananagl/bananagl';

import { SelectionManager } from '@components/Editor/Context';

import { addTriangleModel } from './models/TriangleModel';

export enum CoordinateMode {
    Keep,
    Center,
    None,
}

export interface EditorModelData {
    modelData: ModelData[];
    scene: GL.Scene;
    coordMode: CoordinateMode;
    globalShift: vec3 | null;
    selection: SelectionManager;
    position?: vec3;
    rotation?: vec3;
    scale?: vec3;
    uniforms?: { [name: string]: any };
}

export async function addEditorModels(
    ctx: EditorModelData,
    updateStatus?: (status: string) => void
) {
    let i = 0;
    let { modelData } = ctx;

    for (const model of modelData) {
        if (updateStatus) updateStatus(`Building BVH for ${i++}/${modelData.length}...`);
        if (model.metadata.primitive === PrimitiveType.TRIANGLES)
            ctx.globalShift = await addTriangleModel(model, ctx);
    }

    return ctx.globalShift;
}
