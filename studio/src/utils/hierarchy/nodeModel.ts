import { EditorModel } from '@utils/models/EditorModel';
import { ExtHierarchyModelNode } from '@utils/types';

import { Node, SelectionType } from './node';

export class ModelNode extends Node {
    constructor(public model: EditorModel, public submodelId: number) {
        super();
    }

    selected(selectedModels: SelectionType) {
        const m = selectedModels.get(this.model);
        if (!m) return false;
        return m.has(this.submodelId);
    }

    exportNode(): ExtHierarchyModelNode {
        return {
            model: this.model,
            id: this.submodelId,
            data: this.data,
        };
    }
}
