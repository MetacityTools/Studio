import { IFCLoader } from 'web-ifc-three';

import { IFCData, ModelData, PrimitiveType, UserInputModel } from '@utils/types';

import { retrieveMetadata } from './metadata';
import { flattenModelTree } from './transform';
import { unindexModel } from './unindex';

export async function parse(model: UserInputModel): Promise<ModelData> {
    console.log(`Loading IFC ${model.name}`);
    const data = model.data as IFCData;

    const parsedData = await load(data.buffer);

    if (!parsedData) {
        throw new Error(`Failed to load model ${model.name}`);
    }

    const { geometry, metadata } = parsedData;

    return {
        geometry,
        metadata: {
            name: model.name,
            data: metadata,
            primitive: PrimitiveType.TRIANGLES,
        },
    };
}

const wasmPath = '/';

async function load(buffer: ArrayBuffer) {
    const loader = await setupLoader();
    try {
        const { metadata, flatModels } = await loadModel(loader, buffer);
        const data = unindexModel(flatModels);
        return {
            geometry: data,
            metadata,
        };
    } catch (e) {
        console.error(e);
    }
}

async function loadModel(loader: IFCLoader, buffer: ArrayBuffer) {
    const model = await loader.parse(buffer);
    const flatModels = flattenModelTree(model);
    const metadata = await retrieveMetadata(model, loader, flatModels);
    model.ifcManager?.close(model.modelID);
    return { metadata, flatModels };
}

async function setupLoader() {
    const loader = new IFCLoader();

    //at our own risk
    await loader.ifcManager.setWasmPath(wasmPath);
    (loader.ifcManager.state.api as any).isWasmPathAbsolute = true;
    loader.ifcManager.useWebWorkers(false);
    return loader;
}
