import { parse as parseGLTF } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
import { GLTFData, GLTFParsedData, ModelData, UserInputModel } from 'types';

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
    const data = model.data as GLTFData;
    return (await parseGLTF(data.buffer, GLTFLoader, {
        worker: false,
    })) as GLTFParsedData;
}
