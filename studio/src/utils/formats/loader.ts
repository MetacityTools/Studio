import GLTFWorker from '@utils/formats/gltf?worker';
import IFCWorker from '@utils/formats/ifc?worker';
import ShapefileWorker from '@utils/formats/shapefile?worker';
import { ModelData, UserInputModel } from '@utils/types';

import { WorkerPool } from './pool';

export async function load(
    event: React.ChangeEvent<HTMLInputElement>,
    updateStatus?: (status: string) => void
) {
    const files = await loadFiles(event);
    const models = await loadModels(files, updateStatus);
    return models;
}

export async function loadFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) {
        return [];
    }

    const gltf = await prepareGLTF(files);
    const ifc = await prepareIFC(files);
    const shapefile = await prepareShapefile(files);

    return [...gltf, ...ifc, ...shapefile];
}

async function prepareGLTF(files: FileList): Promise<UserInputModel[]> {
    const data = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('gltf') || file.name.endsWith('glb')) {
            const buffer = await file.arrayBuffer();
            data.push({
                name: file.name,
                data: {
                    buffer,
                },
            });
        }
    }
    return data;
}

async function prepareIFC(files: FileList): Promise<UserInputModel[]> {
    const data = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('ifc')) {
            const buffer = await file.arrayBuffer();
            data.push({
                name: file.name,
                data: {
                    buffer,
                },
            });
        }
    }
    return data;
}

async function prepareShapefile(files: FileList): Promise<UserInputModel[]> {
    const data = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('shp')) {
            const shp = await file.arrayBuffer();
            const shx = await getFile(files, file.name.replace('.shp', '.shx'));
            const dbf = await getFile(files, file.name.replace('.shp', '.dbf'));
            const prj = await getFile(files, file.name.replace('.shp', '.prj'));
            const cpg = await getFile(files, file.name.replace('.shp', '.cpg'));
            data.push({
                name: file.name,
                data: {
                    shp,
                    shx,
                    dbf,
                    prj,
                    cpg,
                },
            });
        }
    }
    return data;
}

async function getFile(files: FileList, name: string) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.toLowerCase() === name.toLowerCase()) {
            return await file.arrayBuffer();
        }
    }
    return undefined;
}

const pool = new WorkerPool<UserInputModel, ModelData>(10);

export async function loadModels(
    models: UserInputModel[],
    updateStatus?: (status: string) => void
) {
    const jobs: Promise<ModelData>[] = [];
    for (const model of models) {
        if (model.name.endsWith('gltf') || model.name.endsWith('glb')) {
            jobs.push(loadWorker(model, GLTFWorker, updateStatus));
        } else if (model.name.endsWith('ifc')) {
            jobs.push(loadWorker(model, IFCWorker, updateStatus));
        } else if (model.name.endsWith('shp')) {
            jobs.push(loadWorker(model, ShapefileWorker, updateStatus));
        }
    }

    const results = await Promise.all(jobs);
    return results;
}

function loadWorker(
    model: UserInputModel,
    worker: new () => Worker,
    updateStatus?: (status: string) => void
): Promise<ModelData> {
    return new Promise((resolve, reject) => {
        pool.process(
            model,
            (data) => {
                resolve(data);
                updateStatus && updateStatus(`Loaded ${model.name}`);
            },
            worker
        );
    });
}
