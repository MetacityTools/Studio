import { mat4 } from 'gl-matrix';
import { BufferAttribute, Mesh, MeshLambertMaterial } from 'three';
import { IFCModelData, UserInputModel } from 'types';
//this is probs much safer than using our custom implementation...
import { IFCLoader } from 'web-ifc-three';

import { flattenModelTree, getTransferable } from './IFC/transform';

self.onmessage = (e) => {
    parseIFC(e.data);
};

export async function parseIFC(model: UserInputModel) {
    console.log(`Loading IFC ${model.name}`);

    if (model.name.endsWith('.ifc')) {
        console.log(`Loading IFC model ${model.name}`);
        const models = await loadIFC(model.buffer);

        if (!models) {
            console.error(`Failed to load model ${model.name}`);
            return;
        }

        const transferable = getTransferable(models);
        (self as any).postMessage(
            {
                name: model.name,
                data: models,
            },
            transferable
        );
    }
}

const wasmPath = '/';

async function loadIFC(buffer: ArrayBuffer) {
    const loader = new IFCLoader();
    console.log('Loading IFC model');

    //on our own risk
    await loader.ifcManager.setWasmPath(wasmPath);
    (loader.ifcManager.state.api as any).isWasmPathAbsolute = true;
    console.log(loader.ifcManager.state.api);
    loader.ifcManager.useWebWorkers(false);

    //do the loading
    try {
        const model = await loader.parse(buffer);
        const models = flattenModelTree(model);
        return models;
    } catch (e) {
        console.error(e);
    }
}
