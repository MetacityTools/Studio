import { EditorModel } from '@utils/utils';

import { Node } from './node';

export class ModelNode extends Node {
    constructor(public model: EditorModel, public submodelId: number) {
        super();
    }

    selected(selectedModels: Map<EditorModel, Set<number>>) {
        const m = selectedModels.get(this.model);
        if (!m) return false;
        return m.has(this.submodelId);
    }
}
