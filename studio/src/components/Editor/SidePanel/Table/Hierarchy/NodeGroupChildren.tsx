import {
    GroupNode as GroupNodeClass,
    ModelNode as ModelNodeClass,
    Node,
    SelectionType,
} from '@utils/utils';

import { GroupNode, GroupNodeProps } from './NodeGroup';
import { ModelNode } from './NodeModel';

interface GroupNodeChildrenProps extends GroupNodeProps {
    nodeToMove?: Node;
    nodeToLink?: Node;
}

function isSelected(selected: SelectionType, node: ModelNodeClass) {
    const m = selected.get(node.model);
    return m && m.has(node.submodelId);
}

export function GroupNodeChildren(props: GroupNodeChildrenProps) {
    const { node, nodeToMove, nodeToLink, selectedModels } = props;
    const groups = node.children?.filter(
        (child) => child instanceof GroupNodeClass
    ) as GroupNodeClass[];

    const activeChildren = node.children?.filter(
        (child) =>
            child instanceof ModelNodeClass &&
            (isSelected(selectedModels, child) || child === nodeToMove || child === nodeToLink)
    ) as ModelNodeClass[];

    if (groups.length === 0 && activeChildren.length === 0)
        return <div className="text-neutral-400 pl-10">No selected models</div>;

    return (
        <div className="mt-1 pl-8 space-y-1">
            {groups.map((child) => (
                <GroupNode key={child.uuid} selectedModels={selectedModels} node={child} />
            ))}
            {activeChildren.map(
                (child) =>
                    child instanceof ModelNodeClass && (
                        <ModelNode key={child.uuid} selectedModels={selectedModels} node={child} />
                    )
            )}
        </div>
    );
}
