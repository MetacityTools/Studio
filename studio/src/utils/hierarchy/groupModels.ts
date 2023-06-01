import { GroupNode, ModelGraph, ModelNode } from './graph';

export function createGroup(selectedSubmodels: number[], graph: ModelGraph) {
    const selected = new Set(selectedSubmodels);
    const newGroup = new GroupNode();
    let lastParent = null;

    const groupNodes = graph.getSelectedGroups(selected);
    groupNodes.forEach((group) => {
        group.filterComplementDescendantModels(selected);
    });

    const modelNodes = Array.from(selected)
        .map((id) => graph.getModelNode(id))
        .filter((node) => node !== undefined) as ModelNode[];

    for (const node of modelNodes) {
        if (!node.parent) continue;
        lastParent = node.parent;
        node.parent.removeChild(node);
        node.addParent(newGroup);
        newGroup.addChild(node);
    }

    for (const group of groupNodes) {
        if (!group.parent) continue;
        lastParent = group.parent;
        group.parent.removeChild(group);
        group.addParent(newGroup);
        newGroup.addChild(group);
    }

    if (lastParent) {
        lastParent.addChild(newGroup);
        newGroup.addParent(lastParent);
    }

    graph.needsUpdate = true;
}
