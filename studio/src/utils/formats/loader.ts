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
    const files = await loadModelFiles(event);
    const tables = await loadTables(event);
    const styles = await loadStyles(event);
    const models = await loadModels(files, updateStatus);
    return { models, tables, styles };
}

export async function loadStyles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return [];

    const styles = await prepareStyleJSON(files);
    return styles;
}

export async function loadTables(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return [];

    const csv = await prepareCSV(files);
    return csv;
}

export async function loadModelFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return [];

    const gltf = await prepareGLTF(files);
    const ifc = await prepareIFC(files);
    const shapefile = await prepareShapefile(files);
    const metacity = await prepareMetacity(files);

    return [...gltf, ...ifc, ...shapefile, ...metacity];
}

async function prepareMetacity(files: FileList): Promise<UserInputModel[]> {
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

async function prepareCSV(files: FileList): Promise<string[]> {
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

async function prepareStyleJSON(files: FileList): Promise<StyleNode[]> {
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
                if (data) resolve(data);
                else reject(`Could not parse model ${model.name}`);
                updateStatus && updateStatus(`Loaded ${model.name}`);
            },
            worker
        );
    });
}
