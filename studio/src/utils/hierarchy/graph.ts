import { GroupNode } from './nodeGroup';
import { ModelNode } from './nodeModel';

export class ModelGraph {
    root: GroupNode = new GroupNode();
    private onUpdateCallbacks: ((graph: ModelGraph) => void)[] = [];

    addModelToRoot(modelId: number) {
        const node = new ModelNode(modelId);
        this.root.addChild(node);
        node.addParent(this.root);
    }

    getModelNode(modelId: number): ModelNode | undefined {
        return this.root.getModelNode(modelId);
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

    getSelectedGroups(selectedModels: Set<number>) {
        return this.root.getSelectedDescendantGroups(selectedModels);
    }
}
