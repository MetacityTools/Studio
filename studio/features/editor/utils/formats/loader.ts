"use client";

import { ModelData, UserInputModel } from "@editor/data/types";
import { EditorData } from "./metacity/types";
import { WorkerPool } from "./pool";

export async function load(
  files: Map<string, Blob>,
  updateStatus?: (status: string) => void,
) {
  const models = await filterModelFiles(files);
  const modelData = await loadModels(models, updateStatus);
  return modelData;
}

async function filterModelFiles(files: Map<string, Blob>) {
  if (!files) return [];

  const gltf = await filterGLTF(files);
  const ifc = await filterIFC(files);
  const shapefile = await filterShapefile(files);
  const metacity = await filterMetacity(files);

  return [...gltf, ...ifc, ...shapefile, ...metacity];
}

async function filterMetacity(
  files: Map<string, Blob>,
): Promise<UserInputModel[]> {
  const data = [];
  for (const [name, file] of files) {
    if (name.endsWith("metacity") && !name.endsWith("json.metacity")) {
      const buffer = await file.arrayBuffer();
      data.push({
        name: name,
        data: {
          buffer,
        },
      });
    }
  }
  return data;
}

async function filterGLTF(files: Map<string, Blob>): Promise<UserInputModel[]> {
  const data = [];
  for (const [name, file] of files) {
    if (name.endsWith("gltf") || name.endsWith("glb")) {
      const buffer = await file.arrayBuffer();
      data.push({
        name: name,
        data: {
          buffer,
        },
      });
    }
  }
  return data;
}

async function filterIFC(files: Map<string, Blob>): Promise<UserInputModel[]> {
  const data = [];
  for (const [name, file] of files) {
    if (name.endsWith("ifc")) {
      const buffer = await file.arrayBuffer();
      data.push({
        name: name,
        data: {
          buffer,
        },
      });
    }
  }
  return data;
}

async function filterShapefile(
  files: Map<string, Blob>,
): Promise<UserInputModel[]> {
  const data = [];
  for (const [name, file] of files) {
    if (name.endsWith("shp")) {
      const shp = await file.arrayBuffer();
      const shx = await getFile(files, name.replace(".shp", ".shx"));
      const dbf = await getFile(files, name.replace(".shp", ".dbf"));
      const prj = await getFile(files, name.replace(".shp", ".prj"));
      const cpg = await getFile(files, name.replace(".shp", ".cpg"));
      data.push({
        name: name,
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

async function getFile(files: Map<string, Blob>, name: string) {
  for (const [key, file] of files) {
    if (key.toLowerCase() === name.toLowerCase()) {
      return await file.arrayBuffer();
    }
  }
  return undefined;
}

const pool = new WorkerPool<
  UserInputModel,
  EditorData | ModelData | ModelData[]
>(10);

function spawnGLTFWorker() {
  return new Worker(new URL("./gltf.worker.ts", import.meta.url));
}

function spawnMetacityWorker() {
  return new Worker(new URL("./metacity.worker.ts", import.meta.url));
}

function spawnShapefileWorker() {
  return new Worker(new URL("./shapefile.worker.ts", import.meta.url));
}

export async function loadModels(
  models: UserInputModel[],
  updateStatus?: (status: string) => void,
) {
  const jobs: Promise<ModelData | ModelData[] | EditorData>[] = [];
  for (const model of models) {
    if (model.name.endsWith("gltf") || model.name.endsWith("glb")) {
      jobs.push(loadWorker(model, spawnGLTFWorker, updateStatus));
    } else if (model.name.endsWith("shp")) {
      jobs.push(loadWorker(model, spawnShapefileWorker, updateStatus));
    } else if (
      model.name.endsWith("metacity") ||
      model.name.endsWith("mcmodel")
    ) {
      jobs.push(loadWorker(model, spawnMetacityWorker, updateStatus));
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
  worker: () => Worker,
  updateStatus?: (status: string) => void,
): Promise<ModelData | ModelData[] | EditorData> {
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
      worker,
    );
  });
}
