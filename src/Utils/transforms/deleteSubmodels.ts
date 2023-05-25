import { CoordinateMode, addEditorModels } from '@utils/models/addEditorModel';
import { EditorModel } from '@utils/models/models/EditorModel';
import { ModelData } from '@utils/types';

import * as GL from '@bananagl/bananagl';

export async function deleteSubmodels(
    scene: GL.Scene,
    model: EditorModel,
    selectedSubmodels: number[]
) {
    if (selectedSubmodels.length === 0) return;
    const idsToRemove = new Set(selectedSubmodels);

    let originalModelVertexCount = 0;

    const submodel = model.attributes.getAttribute('submodel');
    if (!submodel) throw new Error('submodel attribute not found');

    const submodelBuffer = submodel.buffer.getView(Uint32Array);
    for (let i = 0; i < submodelBuffer.length; i++) {
        if (!idsToRemove.has(submodelBuffer[i])) {
            originalModelVertexCount++;
        }
    }

    const modelData: ModelData = {
        geometry: {
            position: new Float32Array(originalModelVertexCount * 3),
            submodel: new Uint32Array(originalModelVertexCount),
        },
        metadata: {
            name: model.name,
            data: {},
            primitive: model.primitive,
        },
    };

    const position = model.attributes.getAttribute('position');
    if (!position) throw new Error('position attribute not found');

    const positionBuffer = position.buffer.getView(Float32Array);
    const originalPositionBuffer = modelData.geometry.position;
    const originalSubmodelBuffer = modelData.geometry.submodel;

    let originalIndex = 0;
    for (let i = 0; i < submodelBuffer.length; i++) {
        if (!idsToRemove.has(submodelBuffer[i])) {
            originalPositionBuffer[originalIndex * 3] = positionBuffer[i * 3];
            originalPositionBuffer[originalIndex * 3 + 1] = positionBuffer[i * 3 + 1];
            originalPositionBuffer[originalIndex * 3 + 2] = positionBuffer[i * 3 + 2];
            originalSubmodelBuffer[originalIndex] = submodelBuffer[i];
            originalIndex++;
        }
    }

    const originalMetadata = modelData.metadata.data;

    for (let id in model.data) {
        if (!idsToRemove.has(parseInt(id))) {
            originalMetadata[id] = model.data[id];
        }
    }

    await addEditorModels({
        models: [modelData],
        coordMode: CoordinateMode.None,
        scene: scene,
        globalShift: null,
        rotation: model.rotation,
        scale: model.scale,
        position: model.position,
        uniforms: model.uniforms,
    });

    scene.remove(model);
}
