import { mat4 } from 'gl-matrix';
import { BufferAttribute, Mesh, MeshLambertMaterial } from 'three';
import { IFCModelData, UserInputModel } from 'types';
//this is probs much safer than using our custom implementation...
import { IFCLoader } from 'web-ifc-three';

self.onmessage = (e) => {
    parseIFC(e.data);
};

export function parseIFC(models: UserInputModel[]) {
    console.log(`Loading ${models.length} models`);

    models.forEach(async (model) => {
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
    });
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

function flattenModelTree(model: Mesh, parentMatrix: mat4 = mat4.create()): IFCModelData[] {
    const flat: IFCModelData[] = [toIFCModelData(model)];
    const m = flat[0].matrix;
    mat4.multiply(m, m, parentMatrix);

    model.children.forEach((child) => {
        flat.push(...flattenModelTree(child as Mesh, m));
    });
    return flat;
}

function toIFCModelData(mesh: Mesh): IFCModelData {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    return {
        geometry: {
            expressID: (mesh.geometry.attributes.expressID as BufferAttribute).array as Uint32Array,
            position: (mesh.geometry.attributes.position as BufferAttribute).array as Float32Array,
            normal: (mesh.geometry.attributes.normal as BufferAttribute).array as Float32Array,
            index: (mesh.geometry.index as BufferAttribute).array as Uint32Array,
        },
        materials: mats.map((material) => {
            return {
                color: (material as MeshLambertMaterial).color.toArray(),
                opacity: material.opacity,
            };
        }),
        matrix: mesh.matrix.toArray() as mat4,
    };
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
