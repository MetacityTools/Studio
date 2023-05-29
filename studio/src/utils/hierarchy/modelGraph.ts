export class ModelGraph {
    root: ModelGroupNode = new ModelGroupNode();
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
}

export class Node {
    parent?: ModelGroupNode;

    addParent(parent: ModelGroupNode) {
        this.parent = parent;
    }
}

export class ModelGroupNode extends Node {
    children: Node[] = [];

    addChild(child: Node) {
        if (!this.children) this.children = [];
        this.children.push(child);
    }

    removeChild(child: Node) {
        if (!this.children) return;
        const index = this.children.indexOf(child);
        if (index > -1) this.children.splice(index, 1);
    }

    getAllLeaveIds(arr: number[] = []): number[] {
        for (const child of this.children) {
            if (child instanceof ModelNode) arr.push(child.submodelId);
            if (child instanceof ModelGroupNode) child.getAllLeaveIds(arr);
        }
        return arr;
    }

    getModelNode(modelId: number): ModelNode | undefined {
        for (const child of this.children) {
            if (child instanceof ModelNode && child.submodelId === modelId) return child;
            if (child instanceof ModelGroupNode) {
                const node = child.getModelNode(modelId);
                if (node) return node;
            }
        }
    }

    allModelsSelected(set: Set<number>): boolean {
        return this.children
            .map((child) => {
                if (child instanceof ModelNode) return set.has(child.submodelId);
                if (child instanceof ModelGroupNode) return child.allModelsSelected(set);
            })
            .every((b) => b);
    }
}

export class ModelNode extends Node {
    constructor(public submodelId: number) {
        super();
    }
}
