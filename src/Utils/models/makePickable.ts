import * as GL from '@bananagl/bananagl';

import { EditorModel } from './EditorModel';

export function makeModelPickable(model: EditorModel, selection: GL.SelectionManager) {
    model.onPick = (object, idx, ray, t, addToSelection) => {
        const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
        const submodelBuffer = submodel.buffer.getView(Uint32Array);
        if (!submodel) return;
        const id = submodelBuffer[idx * 3];

        if (!addToSelection) selection.clearSelection();
        selection.toggleSelection(id, object as EditorModel);
    };
}
