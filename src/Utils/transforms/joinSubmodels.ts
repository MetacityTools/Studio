import { CoordinateMode, addEditorModels } from '@utils/models/addEditorModel';
import { EditorModel } from '@utils/models/models/EditorModel';
import { ModelData } from '@utils/types';

import * as GL from '@bananagl/bananagl';

export async function joinModel(model: EditorModel, selection: GL.SelectionManager) {
    const selected = selection.selected.filter((s) => s.object === model);
    if (selected.length === 0) return;
    const idsToJoin = new Set(selected.map((s) => s.identifier));

    let minId = Infinity;
    for (const id of idsToJoin) {
        if (id < minId) minId = id;
    }

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
        meta.push(model.data[id]);
        delete model.data[id];
    }

    model.data[minId] = meta;

    selection.clearSelection();
    selection.select(minId, model);
}
