import GLTFWorker from '@utils/formats/gltf.worker?worker';
import IFCWorker from '@utils/formats/ifc.worker?worker';
import MetacityWorker from '@utils/formats/metacity.worker?worker';
import ShapefileWorker from '@utils/formats/shapefile.worker?worker';
import { ModelData, StyleNode, UserInputModel } from '@utils/types';

import { WorkerPool } from './pool';

export async function load(
    event: React.ChangeEvent<HTMLInputElement>,
    updateStatus?: (status: string) => void
) {
    const models = await filterModelFiles(event);
    const tables = await filterTables(event);
    const styles = await filterStyles(event);

    const modelData = await loadModels(models, updateStatus);
    return { models: modelData, tables, styles };
}

export async function loadProjectFiles(name: string, buffer: ArrayBuffer, styles: any) {
    const data = [];
    data.push({
        name: name,
        data: {
            buffer,
        },
    });
    const models = await loadModels(data);
    return { models, styles };
}

export async function filterStyles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return [];

    const data = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.json.metacity') || file.name.endsWith('mcstyle')) {
            const content = await file.text();
            try {
                data.push(JSON.parse(content));
            } catch (e) {
                console.error(e);
            }
        }
    }
    return data;
}

export async function filterTables(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return [];
    const data = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('csv')) {
            const content = await file.text();
            data.push(content);
        }
    }
    return data;
}

export async function filterModelFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return [];

    const gltf = await filterGLTF(files);
    const ifc = await filterIFC(files);
    const shapefile = await filterShapefile(files);
    const metacity = await filterMetacity(files);

    return [...gltf, ...ifc, ...shapefile, ...metacity];
}

async function filterMetacity(files: FileList): Promise<UserInputModel[]> {
    const data = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
            (file.name.endsWith('metacity') && !file.name.endsWith('json.metacity')) ||
            file.name.endsWith('mcmodel')
        ) {
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

async function filterGLTF(files: FileList): Promise<UserInputModel[]> {
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

async function filterIFC(files: FileList): Promise<UserInputModel[]> {
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

async function filterShapefile(files: FileList): Promise<UserInputModel[]> {
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

const pool = new WorkerPool<UserInputModel, ModelData | ModelData[]>(10);

export async function loadModels(
    models: UserInputModel[],
    updateStatus?: (status: string) => void
) {
    const jobs: Promise<ModelData | ModelData[]>[] = [];
    for (const model of models) {
        if (model.name.endsWith('gltf') || model.name.endsWith('glb')) {
            jobs.push(loadWorker(model, GLTFWorker, updateStatus));
        } else if (model.name.endsWith('ifc')) {
            jobs.push(loadWorker(model, IFCWorker, updateStatus));
        } else if (model.name.endsWith('shp')) {
            jobs.push(loadWorker(model, ShapefileWorker, updateStatus));
        } else if (model.name.endsWith('metacity') || model.name.endsWith('mcmodel')) {
            jobs.push(loadWorker(model, MetacityWorker, updateStatus));
        }
    }

    try {
        const results = await Promise.all(jobs);
        const flat = results.flat();
        return flat;
    } catch (e) {
        console.error(e);
        return [];
    }
}

function loadWorker(
    model: UserInputModel,
    worker: new () => Worker,
    updateStatus?: (status: string) => void
): Promise<ModelData | ModelData[]> {
    return new Promise((resolve, reject) => {
        pool.process(
            model,
            (data) => {
                if (data) {
                    resolve(data);
                    updateStatus && updateStatus(`Loading models: Loaded ${model.name}`);
                } else {
                    reject(`Could not parse model ${model.name}`);
                    updateStatus &&
                        updateStatus(`Loading models: Could not parse model ${model.name}`);
                }
            },
            worker
        );
    });
}
