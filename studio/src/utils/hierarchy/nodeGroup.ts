import { SelectionType } from '@utils/components/Context';
import { EditorModel } from '@utils/utils';

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

    removeModel(model: EditorModel) {
        if (!this.children) return;
        for (const child of this.children) {
            if (child instanceof ModelNode && child.model === model) {
                this.removeChild(child);
                break;
            }
            if (child instanceof GroupNode) {
                child.removeModel(model);
                if (child.children.length === 0) this.removeChild(child);
            }
        }
    }

    updateModel(oldModel: EditorModel, newModel: EditorModel, submodelIDs?: Set<number>) {
        if (!this.children) return;
        for (const child of this.children) {
            if (child instanceof ModelNode && child.model === oldModel) {
                if (!submodelIDs || submodelIDs.has(child.submodelId)) child.model = newModel;
            }
            if (child instanceof GroupNode) {
                child.updateModel(oldModel, newModel, submodelIDs);
            }
        }
    }

    removeSubmodels(model: EditorModel, ids: Set<number>) {
        if (!this.children) return;
        for (const child of this.children) {
            if (child instanceof ModelNode && child.model === model && ids.has(child.submodelId)) {
                this.removeChild(child);
                break;
            }
            if (child instanceof GroupNode) {
                child.removeSubmodels(model, ids);
                if (child.children.length === 0) this.removeChild(child);
            }
        }
    }

    getTreeSelection(selection: SelectionType = new Map()): SelectionType {
        for (const child of this.children) {
            if (child instanceof ModelNode) {
                const m = selection.get(child.model);
                if (!m) selection.set(child.model, new Set([child.submodelId]));
                else m.add(child.submodelId);
            }

            if (child instanceof GroupNode) child.getTreeSelection(selection);
        }
        return selection;
    }

    getModelNode(model: EditorModel, modelId: number): ModelNode | undefined {
        for (const child of this.children) {
            if (child instanceof ModelNode && child.model === model && child.submodelId === modelId)
                return child;
            if (child instanceof GroupNode) {
                const node = child.getModelNode(model, modelId);
                if (node) return node;
            }
        }
    }

    selected(selectedModels: SelectionType) {
        return this.children.every((child) => {
            return child.selected(selectedModels);
        });
    }

    getSelectedDescendantGroups(selectedModels: SelectionType, groups: GroupNode[] = []) {
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

    filterComplementDescendantModels(selection: SelectionType) {
        if (!this.children) return;
        for (const child of this.children) {
            if (child instanceof ModelNode) {
                const m = selection.get(child.model);
                if (!m) continue;
                if (m.has(child.submodelId)) m.delete(child.submodelId);
            } else if (child instanceof GroupNode) {
                child.filterComplementDescendantModels(selection);
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