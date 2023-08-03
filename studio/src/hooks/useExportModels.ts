import { vec3 } from 'gl-matrix';
import React from 'react';

import { exportModel } from '@utils/formats/metacity/write';

import { EditorModel, EditorModelData } from '@data/EditorModel';

import { context } from '@context/ViewContext';

export function useExportModels() {
    const ctx = React.useContext(context);

    const exportProject = async (title: string) => {
        const models = await extractModels(ctx.models);
        if (!models) return;
        exportModel(models, ctx.styles, title);
    };

    return exportProject;
}

async function extractModels(models: EditorModel[]) {
    if (models.length === 0) throw new Error('No models to convert.');
    const processed: EditorModelData[] = [];

    for (const model of models) {
        //get required attributes
        const p = model.attributes.getAttribute('position');
        const s = model.attributes.getAttribute('submodel');
        if (!p || !s) throw new Error('Required attributes not found during conversion.');

        //get model nodes
        const modelMetadata = model.metadata;

        //apply positions
        const pi = new Float32Array(p.buffer.data.length);
        pi.set(p.buffer.data);
        const v = vec3.create();
        for (let i = 0; i < pi.length; i += 3) {
            vec3.set(v, pi[i], pi[i + 1], pi[i + 2]);
            vec3.transformMat4(v, v, model.transform);
            pi[i] = v[0];
            pi[i + 1] = v[1];
            pi[i + 2] = v[2];
        }

        //get view
        const sv = s.buffer.getView(Uint32Array) as Uint32Array;

        //create model data
        const modelData: EditorModelData = {
            geometry: {
                position: pi,
                submodel: sv,
            },
            metadata: {
                data: modelMetadata,
                name: model.name,
                primitive: model.primitive,
            },
        };

        //add to processed
        processed.push(modelData);
    }

    return processed;
}
