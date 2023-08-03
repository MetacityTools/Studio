import React from 'react';

import { EditorModel, EditorModelData } from '@data/EditorModel';
import { ModelMetadataRecords } from '@data/types';

import { context } from '@context/ViewContext';

import { useImportModels } from './useImportModels';
import { useRemoveModels } from './useRemoveModels';
import { useSelection } from './useSelection';

export function useRemoveSubmodels() {
    const ctx = React.useContext(context);
    const select = useSelection();
    const importModels = useImportModels();
    const removeModels = useRemoveModels();

    const removeSubmodels = async (model: EditorModel, submodels: Set<number>) => {
        const data = removeSubmodelsFc(model, submodels);
        if (!data) return;
        if (data.geometry.position.length > 0) await importModels([data]);
        removeModels([model]);
    };

    return removeSubmodels;
}

function removeSubmodelsFc(model: EditorModel, idsToRemove: Set<number>) {
    if (idsToRemove.size === 0) return;
    let originalModelVertexCount = 0;

    const submodel = model.attributes.getAttribute('submodel');
    if (!submodel) throw new Error('submodel attribute not found');

    const submodelBuffer = submodel.buffer.getView(Uint32Array);
    for (let i = 0; i < submodelBuffer.length; i++) {
        if (!idsToRemove.has(submodelBuffer[i])) {
            originalModelVertexCount++;
        }
    }

    const metadata: ModelMetadataRecords = {};
    const modelData: EditorModelData = {
        geometry: {
            position: new Float32Array(originalModelVertexCount * 3),
            submodel: new Uint32Array(originalModelVertexCount),
        },
        metadata: {
            data: metadata,
            name: model.name,
            primitive: model.primitive,
        },
        position: model.position,
        rotation: model.rotation,
        scale: model.scale,
        uniforms: model.uniforms,
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

    const keys = Object.keys(model.metadata);
    for (const key of keys) {
        const id = parseInt(key);
        if (!idsToRemove.has(id)) {
            metadata[id] = model.metadata[id];
        }
    }

    return modelData;
}
