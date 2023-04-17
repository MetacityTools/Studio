import { parse as parseGLTF } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
import { GLTFParsedData, ModelData, UserInputModel } from 'types';

import { swapFromYupToZup } from './transform';
import { unindexGeometry } from './unindex';

export async function parse(model: UserInputModel): Promise<ModelData> {
    const gltf = await loadModel(model);

    const { position, submodel, metadata } = unindexGeometry(gltf);
    //swapFromYupToZup(position);

    return {
        geometry: {
            position,
            submodel,
        },
        metadata: {
            name: model.name,
            data: metadata,
        },
    };
}

async function loadModel(model: UserInputModel) {
    return (await parseGLTF(model.buffer, GLTFLoader, {
        worker: false,
    })) as GLTFParsedData;
}
