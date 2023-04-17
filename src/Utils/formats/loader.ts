import { ModelData, UserInputModel } from 'types';

import GLTFWorker from '@utils/formats/gltf?worker';
import IFCWorker from '@utils/formats/ifc?worker';

export async function loadModels(models: UserInputModel[]) {
    const jobs: Promise<ModelData>[] = [];
    for (const model of models) {
        if (model.name.endsWith('gltf') || model.name.endsWith('glb')) {
            jobs.push(loadGLTF(model));
        } else if (model.name.endsWith('ifc')) {
            jobs.push(loadIFC(model));
        }
    }

    const results = await Promise.all(jobs);
    return results;
}

function loadGLTF(model: UserInputModel): Promise<ModelData> {
    return new Promise((resolve, reject) => {
        const worker = new GLTFWorker();
        worker.onmessage = (e) => {
            resolve(e.data);
            worker.terminate();
        };
        worker.onerror = (e) => {
            console.error(e);
            reject(e);
            worker.terminate();
        };
        worker.postMessage(model);
    });
}

function loadIFC(model: UserInputModel): Promise<ModelData> {
    return new Promise((resolve, reject) => {
        const worker = new IFCWorker();
        worker.onmessage = (e) => {
            resolve(e.data);
            worker.terminate();
        };
        worker.onerror = (e) => {
            console.error(e);
            reject(e);
            worker.terminate();
        };
        worker.postMessage(model);
    });
}
