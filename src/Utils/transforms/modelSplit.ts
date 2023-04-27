import { ModelData } from 'types';

import { EditorModel } from '@utils/models/EditorModel';
import { addEditorModels } from '@utils/models/addEditorModel';

import * as GL from '@bananagl/bananagl';
import { TypedArray } from '@bananagl/shaders/shader';

export function splitModel(scene: GL.Scene, model: EditorModel, selection: GL.SelectionManager) {
    const selected = selection.selected.filter((s) => s.object === model);
    if (selected.length === 0) return;
    const idsToRemove = new Set(selected.map((s) => s.identifier));

    let originalModelVertexCount = 0;
    let newModelVertexCount = 0;

    const submodel = model.attributes.getAttribute('submodel');
    if (!submodel) throw new Error('submodel attribute not found');

    const submodelBuffer = submodel.buffer.getView(Uint32Array);
    for (let i = 0; i < submodelBuffer.length; i++) {
        if (!idsToRemove.has(submodelBuffer[i])) {
            originalModelVertexCount++;
        } else {
            newModelVertexCount++;
        }
    }

    const originalModelData: ModelData = {
        geometry: {
            position: new Float32Array(originalModelVertexCount * 3),
            submodel: new Uint32Array(originalModelVertexCount),
        },
        metadata: {
            name: 'partA_' + model.name,
            data: {},
        },
    };

    const newModelData: ModelData = {
        geometry: {
            position: new Float32Array(newModelVertexCount * 3),
            submodel: new Uint32Array(newModelVertexCount),
        },
        metadata: {
            name: 'partB_' + model.name,
            data: {},
        },
    };

    const position = model.attributes.getAttribute('position');
    if (!position) throw new Error('position attribute not found');

    const positionBuffer = position.buffer.getView(Float32Array);
    const originalPositionBuffer = originalModelData.geometry.position;
    const newPositionBuffer = newModelData.geometry.position;
    const originalSubmodelBuffer = originalModelData.geometry.submodel;
    const newSubmodelBuffer = newModelData.geometry.submodel;

    let originalIndex = 0;
    let newIndex = 0;
    for (let i = 0; i < submodelBuffer.length; i++) {
        if (!idsToRemove.has(submodelBuffer[i])) {
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

    const originalMetadata = originalModelData.metadata.data;
    const newMetadata = newModelData.metadata.data;

    for (let id in model.data) {
        if (!idsToRemove.has(parseInt(id))) {
            originalMetadata[id] = model.data[id];
        } else {
            newMetadata[id] = model.data[id];
        }
    }

    addEditorModels(
        [originalModelData, newModelData],
        selection,
        scene,
        false,
        model.position,
        model.rotation,
        model.scale,
        model.uniforms
    );

    scene.remove(model);
}
