import { Node } from './node';
import { ModelNode } from './nodeModel';

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
