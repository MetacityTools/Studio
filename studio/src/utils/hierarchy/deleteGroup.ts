import { GroupNode, ModelGraph } from './graph';

export function deleteGroup(group: GroupNode, graph: ModelGraph) {
    if (!group.parent) return; //cannot delete root
    const parent = group.parent;

    for (const child of group.children) {
        child.addParent(parent);
        parent.addChild(child);
    }

    parent.removeChild(group);
    group = null as any;
    graph.needsUpdate = true;
}
