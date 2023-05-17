import { vec3 } from 'gl-matrix';

import { ModelData } from '@utils/types';

import * as GL from '@bananagl/bananagl';

import { addTriangleModel } from './models/TriangleModel';

export enum CoordinateMode {
    Keep,
    Center,
    None,
}

export interface EditorModelData {
    modelData: ModelData[];
    selection: GL.SelectionManager;
    scene: GL.Scene;
    coordMode: CoordinateMode;
    globalShift: vec3 | null;
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
        if (model.metadata.primitive === 'triangle')
            ctx.globalShift = await addTriangleModel(model, ctx);
        if (updateStatus) updateStatus(`Building BVH for ${i++}/${modelData.length}...`);
    }

    return ctx.globalShift;
}
