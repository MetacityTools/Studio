import { SelectionType } from '@utils/components/Context';
import { EditorModel } from '@utils/utils';

import { Node } from './node';
import { GroupNode } from './nodeGroup';
import { ModelNode } from './nodeModel';

export class ModelGraph {
    root: GroupNode = new GroupNode();
    private onUpdateCallbacks: ((graph: ModelGraph) => void)[] = [];

    addModel(model: EditorModel, data: { [key: number]: any } = {}) {
        const submodelIDs = model.submodelIDs;
        console.log('addModel', submodelIDs, data);
        for (const submodelID of submodelIDs) {
            const node = new ModelNode(model, submodelID);
            node.data = data[submodelID] ?? {};
            this.root.addChild(node);
            node.addParent(this.root);
        }
    }

    getModel(model: EditorModel, modelId: number): ModelNode | undefined {
        return this.root.getModelNode(model, modelId);
    }

    removeModel(model: EditorModel) {
        this.root.removeModel(model);
    }

    removeSubmodels(model: EditorModel, ids: Set<number>) {
        this.root.removeSubmodels(model, ids);
    }

    updateModel(oldModel: EditorModel, newModel: EditorModel, submodelIDs?: Set<number>) {
        this.root.updateModel(oldModel, newModel, submodelIDs);
    }

    set needsUpdate(value: boolean) {
        if (value) this.onUpdateCallbacks.forEach((cb) => cb(this));
    }

    addChangeListener(cb: (graph: ModelGraph) => void) {
        this.onUpdateCallbacks.push(cb);
    }

    copy(graph: ModelGraph) {
        this.root = graph.root;
    }

    getSelectedGroups(selectedModels: SelectionType) {
        return this.root.getSelectedDescendantGroups(selectedModels);
    }

    moveNode(node: Node, newParent: GroupNode) {
        const prevParent = node.parent;
        if (prevParent) prevParent.removeChild(node);
        newParent.addChild(node);
        node.addParent(newParent);
        this.needsUpdate = true;
        if (prevParent?.children.length === 0) prevParent.parent?.removeChild(prevParent);
    }
}
