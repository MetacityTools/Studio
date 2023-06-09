import { Node } from './node';
import { GroupNode } from './nodeGroup';
import { ModelNode } from './nodeModel';

export class ModelGraph {
    root: GroupNode = new GroupNode();
    private onUpdateCallbacks: ((graph: ModelGraph) => void)[] = [];

    addModelToRoot(modelId: number, data: { [key: string]: any } = {}) {
        const node = new ModelNode(modelId);
        node.data = data;
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

    moveNode(node: Node, newParent: GroupNode) {
        const prevParent = node.parent;
        if (prevParent) prevParent.removeChild(node);
        newParent.addChild(node);
        node.addParent(newParent);
        this.needsUpdate = true;
        if (prevParent?.children.length === 0) prevParent.parent?.removeChild(prevParent);
    }
}
