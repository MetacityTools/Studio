import { UserInputModel } from 'types';

import { IFCManager } from './IFC/components/IFCManager';
import { IFCModel, IFCModelData } from './IFC/components/IFCModel';

self.onmessage = (e) => {
    parseIFC(e.data);
};

export function parseIFC(models: UserInputModel[]) {
    console.log(`Loading ${models.length} models`);
    models.forEach(async (model) => {
        if (model.name.endsWith('.ifc')) {
            console.log(`Loading IFC model ${model.name}`);
            const models = await loadIFC(model.buffer);
            const transferable = getTransferable(models);
            (self as any).postMessage(
                {
                    name: model.name,
                    data: models,
                },
                transferable
            );
        }
    });
}

const wasmPath = '/';

async function loadIFC(buffer: ArrayBuffer) {
    const manager = new IFCManager();
    await manager.setWasmPath(wasmPath, true);
    const model = await manager.parse(buffer);
    const models = flattenModelTree(model);
    return models;
}

function flattenModelTree(model: IFCModel) {
    const flat: IFCModelData[] = [model.toIFCModelData()];
    model.children.forEach((child) => {
        flat.push(...flattenModelTree(child as IFCModel));
    });
    return flat;
}

function getTransferable(models: IFCModelData[]) {
    const transferable: Transferable[] = [];
    models.forEach((model) => {
        if (model.geometry.expressID) transferable.push(model.geometry.expressID.buffer);
        if (model.geometry.position) transferable.push(model.geometry.position.buffer);
        if (model.geometry.normal) transferable.push(model.geometry.normal.buffer);
        if (model.geometry.index) transferable.push(model.geometry.index.buffer);
    });
    return transferable;
}
