import {
  GLTFData,
  GLTFParsedData,
  ModelData,
  PrimitiveType,
  UserInputModel,
} from "@editor/data/types";
import { parse as parseGLTF } from "@loaders.gl/core";
import { GLTFLoader, postProcessGLTF } from "@loaders.gl/gltf";
import { unindexGeometry } from "./unindex";

export async function parse(model: UserInputModel): Promise<ModelData> {
  const gltf = await loadModel(model);

  const { position, submodel, metadata } = unindexGeometry(gltf);

  return {
    uuid: self.crypto.randomUUID(),
    geometry: {
      position,
      submodel,
    },
    metadata: {
      name: model.name,
      visible: true,
      primitive: PrimitiveType.TRIANGLES,
      data: metadata,
    },
  };
}

async function loadModel(model: UserInputModel) {
  const data = model.data as GLTFData;
  const parsed = await parseGLTF(data.buffer, GLTFLoader, {
    worker: false,
  });
  return postProcessGLTF(parsed) as GLTFParsedData;
}
