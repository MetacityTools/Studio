import { ModelGeometry, UserInputModel } from 'types';
import { IFCLoader } from 'web-ifc-three';

import { flattenModelTree } from './transform';
import { unindexModel } from './unindex';

export async function parse(model: UserInputModel): Promise<ModelGeometry> {
    console.log(`Loading IFC ${model.name}`);

    const vertices = await load(model.buffer);

    if (!vertices) {
        throw new Error(`Failed to load model ${model.name}`);
    }

    return {
        position: vertices,
    };
}

const wasmPath = '/';

async function load(buffer: ArrayBuffer) {
    const loader = await setupLoader();
    try {
        const models = await loadModel(loader, buffer);
        const vertices = unindexModel(models);
        return vertices;
    } catch (e) {
        console.error(e);
    }
}

async function loadModel(loader: IFCLoader, buffer: ArrayBuffer) {
    const model = await loader.parse(buffer);
    const models = flattenModelTree(model);
    return models;
}

async function setupLoader() {
    const loader = new IFCLoader();

    //at our own risk
    await loader.ifcManager.setWasmPath(wasmPath);
    (loader.ifcManager.state.api as any).isWasmPathAbsolute = true;
    console.log(loader.ifcManager.state.api);
    loader.ifcManager.useWebWorkers(false);
    return loader;
}
