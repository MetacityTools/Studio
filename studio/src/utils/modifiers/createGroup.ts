import { ModelGraph } from '@utils/hierarchy/graph';
import { GroupNode } from '@utils/hierarchy/nodeGroup';
import { ModelNode } from '@utils/hierarchy/nodeModel';
import { SelectionType } from '@utils/utils';

export function createGroup(selection: SelectionType, graph: ModelGraph) {
    const newGroup = new GroupNode();
    let lastParent = null;

    const groupNodes = graph.getSelectedGroups(selection);
    groupNodes.forEach((group) => {
        group.filterComplementDescendantModels(selection);
    });

    const modelNodes = Array.from(selection)
        .map(([model, submodelIDs]) =>
            Array.from(submodelIDs).map((id) => graph.getModel(model, id))
        )
        .flat()
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
