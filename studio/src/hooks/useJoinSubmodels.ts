import { EditorModel } from '@data/EditorModel';

import { useSelection } from './useSelection';

export function useJoinSubmodels() {
    const select = useSelection();

    const join = async (model: EditorModel, submodels: Set<number>) => {
        const newSubmodelId = await joinSubmodels(model, submodels);
        if (!newSubmodelId) return;
        select(new Map([[model, new Set([newSubmodelId])]]));
    };

    return join;
}

async function joinSubmodels(model: EditorModel, idsToJoin: Set<number>) {
    if (idsToJoin.size === 0) return;

    let minId = Infinity;
    for (const id of idsToJoin) if (id < minId) minId = id;

    const submodel = model.attributes.getAttribute('submodel');
    if (!submodel) throw new Error('submodel attribute not found');

    const submodelBuffer = submodel.buffer.getView(Uint32Array);
    for (let i = 0; i < submodelBuffer.length; i++) {
        if (idsToJoin.has(submodelBuffer[i])) {
            submodelBuffer[i] = minId;
        }
    }

    submodel.buffer.toUpdate();

    const meta = [];
    for (const id of idsToJoin) {
        meta.push(model.metadata[id]);
        delete model.metadata[id];
    }

    model.metadata[minId] = meta;
    return minId;
}
