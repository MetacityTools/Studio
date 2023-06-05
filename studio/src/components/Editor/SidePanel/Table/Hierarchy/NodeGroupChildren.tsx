import { GroupNode as GroupNodeClass, ModelNode as ModelNodeClass, Node } from '@utils/utils';

import { HierarchyNodeRow } from '@elements/Hierarchy';

import { GroupNode, GroupNodeProps } from './NodeGroup';
import { ModelNode } from './NodeModel';

interface GroupNodeChildrenProps extends GroupNodeProps {
    nodeToMove?: Node;
}

export function GroupNodeChildren(props: GroupNodeChildrenProps) {
    const { model, submodels, node, nodeToMove } = props;
    const groups = node.children?.filter(
        (child) => child instanceof GroupNodeClass
    ) as GroupNodeClass[];
    const activeChildren = node.children?.filter(
        (child) =>
            child instanceof ModelNodeClass &&
            (submodels.has(child.submodelId) || child === nodeToMove)
    ) as ModelNodeClass[];

    if (groups.length === 0 && activeChildren.length === 0)
        return <div className="text-neutral-400 pl-10">No selected models</div>;

    return (
        <div className="mt-1 pl-8 space-y-1">
            {groups.map((child) => (
                <GroupNode key={child.uuid} model={model} submodels={submodels} node={child} />
            ))}
            {activeChildren.map(
                (child) =>
                    child instanceof ModelNodeClass && (
                        <ModelNode
                            key={child.uuid}
                            model={model}
                            submodels={submodels}
                            node={child}
                        />
                    )
            )}
        </div>
    );
}
