import { vec3 } from "gl-matrix";

import { EditorModel, EditorModelData } from "@editor/data/EditorModel";
import { ModelMetadataRecords } from "@editor/data/types";

import { useCallback } from "react";
import { useImportModels } from "./useImportModels";
import { useRemoveModels } from "./useRemoveModels";

export function useSplitModel() {
  const importModels = useImportModels();
  const removeModels = useRemoveModels();

  const split = useCallback(
    async (oldModel: EditorModel, submodels: Set<number>) => {
      const newModels = splitModel(oldModel, submodels);
      if (!newModels) return;
      await importModels(newModels, {
        disableShift: true,
      });
      removeModels([oldModel]);
    },
    [importModels, removeModels],
  );

  return split;
}

function splitModel(model: EditorModel, submodelIDs: Set<number>) {
  if (submodelIDs.size === 0) return;

  let originalModelVertexCount = 0;
  let newModelVertexCount = 0;

  const submodel = model.attributes.getAttribute("submodel");
  if (!submodel) throw new Error("submodel attribute not found");

  const submodelBuffer = submodel.buffer.getView(Uint32Array);
  for (let i = 0; i < submodelBuffer.length; i++) {
    if (!submodelIDs.has(submodelBuffer[i])) {
      originalModelVertexCount++;
    } else {
      newModelVertexCount++;
    }
  }

  const originalMetadata: ModelMetadataRecords = {};
  const originalModelData: EditorModelData = {
    uuid: self.crypto.randomUUID(),
    geometry: {
      position: new Float32Array(originalModelVertexCount * 3),
      submodel: new Uint32Array(originalModelVertexCount),
    },
    metadata: {
      data: originalMetadata,
      visible: true,
      name: "partA_" + model.name,
      primitive: model.primitive,
    },
    rotation: vec3.clone(model.rotation),
    scale: vec3.clone(model.scale),
    position: vec3.clone(model.position),
    uniforms: model.uniforms,
  };

  const newMetadata: ModelMetadataRecords = {};
  const newModelData: EditorModelData = {
    uuid: self.crypto.randomUUID(),
    geometry: {
      position: new Float32Array(newModelVertexCount * 3),
      submodel: new Uint32Array(newModelVertexCount),
    },
    metadata: {
      data: newMetadata,
      visible: true,
      name: "partB_" + model.name,
      primitive: model.primitive,
    },
    rotation: model.rotation,
    scale: model.scale,
    position: model.position,
    uniforms: model.uniforms,
  };

  const position = model.attributes.getAttribute("position");
  if (!position) throw new Error("position attribute not found");

  const positionBuffer = position.buffer.getView(Float32Array);
  const originalPositionBuffer = originalModelData.geometry.position;
  const newPositionBuffer = newModelData.geometry.position;
  const originalSubmodelBuffer = originalModelData.geometry.submodel;
  const newSubmodelBuffer = newModelData.geometry.submodel;

  let originalIndex = 0;
  let newIndex = 0;
  for (let i = 0; i < submodelBuffer.length; i++) {
    if (!submodelIDs.has(submodelBuffer[i])) {
      originalPositionBuffer[originalIndex * 3] = positionBuffer[i * 3];
      originalPositionBuffer[originalIndex * 3 + 1] = positionBuffer[i * 3 + 1];
      originalPositionBuffer[originalIndex * 3 + 2] = positionBuffer[i * 3 + 2];
      originalSubmodelBuffer[originalIndex] = submodelBuffer[i];
      originalIndex++;
    } else {
      newPositionBuffer[newIndex * 3] = positionBuffer[i * 3];
      newPositionBuffer[newIndex * 3 + 1] = positionBuffer[i * 3 + 1];
      newPositionBuffer[newIndex * 3 + 2] = positionBuffer[i * 3 + 2];
      newSubmodelBuffer[newIndex] = submodelBuffer[i];
      newIndex++;
    }
  }

  const keys = Object.keys(model.metadata);
  for (const key of keys) {
    const id = parseInt(key);
    const value = model.metadata[id];
    if (!submodelIDs.has(id)) {
      originalMetadata[id] = value;
    } else {
      newMetadata[id] = value;
    }
  }

  return [originalModelData, newModelData];
}
