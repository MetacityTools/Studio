import { TypedArray, UserInputModel } from 'types';

import { IFCManager } from './IFC/components/IFCManager';
import { IFCModel, IFCModelData } from './IFC/components/IFCModel';

class IFCLoader {
    readonly data: { [item: number]: TypedArray } = {};
    readonly wasmPath = '/';

    async loadIFC(name: string, buffer: ArrayBuffer) {
        const manager = new IFCManager();
        await manager.setWasmPath(this.wasmPath, true);
        const model = await manager.parse(buffer);
        const models = this.flattenModelTree(model);
        return models;
    }

    private flattenModelTree(model: IFCModel) {
        const flat: IFCModelData[] = [model.toIFCModelData()];
        model.children.forEach((child) => {
            flat.push(...this.flattenModelTree(child as IFCModel));
        });
        return flat;
    }

    static transferable(models: IFCModelData[]) {
        const transferable: Transferable[] = [];
        models.forEach((model) => {
            if (model.geometry.expressID) transferable.push(model.geometry.expressID.buffer);
            if (model.geometry.position) transferable.push(model.geometry.position.buffer);
            if (model.geometry.normal) transferable.push(model.geometry.normal.buffer);
            if (model.geometry.index) transferable.push(model.geometry.index.buffer);
        });
        return transferable;
    }
}

export function parseIFC(models: UserInputModel[]) {
    console.log(`Loading ${models.length} models`);
    models.forEach(async (model) => {
        if (model.name.endsWith('.ifc')) {
            console.log(`Loading IFC model ${model.name}`);
            const ifcLoader = new IFCLoader();
            const models = await ifcLoader.loadIFC(model.name, model.buffer);
            const transferable = IFCLoader.transferable(models);
            console.log(models);
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

self.onmessage = (e) => {
    parseIFC(e.data);
};
