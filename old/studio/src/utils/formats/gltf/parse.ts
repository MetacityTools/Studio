import { parse as parseGLTF } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';

import { GLTFData, GLTFParsedData, ModelData, PrimitiveType, UserInputModel } from '@data/types';

import { unindexGeometry } from './unindex';

export async function parse(model: UserInputModel): Promise<ModelData> {
    const gltf = await loadModel(model);

    const { position, submodel, metadata } = unindexGeometry(gltf);

    return {
        geometry: {
            position,
            submodel,
        },
        metadata: {
            name: model.name,
            primitive: PrimitiveType.TRIANGLES,
            data: metadata,
        },
    };
}

async function loadModel(model: UserInputModel) {
    const data = model.data as GLTFData;
    return (await parseGLTF(data.buffer, GLTFLoader, {
        worker: false,
    })) as GLTFParsedData;
}
