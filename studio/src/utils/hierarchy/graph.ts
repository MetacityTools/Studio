import { v4 as uuidv4 } from 'uuid';

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

export abstract class Node {
    parent?: GroupNode;
    uuid = uuidv4();

    addParent(parent: GroupNode) {
        this.parent = parent;
    }

    abstract selected(selectedModels: Set<number>): boolean;
}

export class GroupNode extends Node {
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
            if (child instanceof GroupNode) child.getAllLeaveIds(arr);
        }
        return arr;
    }

    getModelNode(modelId: number): ModelNode | undefined {
        for (const child of this.children) {
            if (child instanceof ModelNode && child.submodelId === modelId) return child;
            if (child instanceof GroupNode) {
                const node = child.getModelNode(modelId);
                if (node) return node;
            }
        }
    }

    selected(selectedModels: Set<number>) {
        return this.children.every((child) => {
            return child.selected(selectedModels);
        });
    }

    getSelectedDescendantGroups(selectedModels: Set<number>, groups: GroupNode[] = []) {
        if (this.selected(selectedModels)) {
            groups.push(this);
        } else {
            for (const child of this.children) {
                if (child instanceof GroupNode)
                    child.getSelectedDescendantGroups(selectedModels, groups);
            }
        }
        return groups;
    }

    filterComplementDescendantModels(selectedModels: Set<number>) {
        if (!this.children) return;
        for (const child of this.children) {
            if (child instanceof ModelNode && selectedModels.has(child.submodelId)) {
                selectedModels.delete(child.submodelId);
            } else if (child instanceof GroupNode) {
                child.filterComplementDescendantModels(selectedModels);
            }
        }
    }

    isAncestorOf(node: Node): boolean {
        return this.children.some((child) => {
            if (child === node) return true;
            if (child instanceof GroupNode) return child.isAncestorOf(node);
            return false;
        });
    }

    isDescendantOf(node: Node): boolean {
        return this.parent === node || ((this.parent && this.parent.isDescendantOf(node)) ?? false);
    }
}

export class ModelNode extends Node {
    constructor(public submodelId: number) {
        super();
    }

    selected(selectedModels: Set<number>) {
        return selectedModels.has(this.submodelId);
    }
}
