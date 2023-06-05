import {
    GroupNode as GroupNodeClass,
    ModelNode as ModelNodeClass,
    Node,
} from '@utils/hierarchy/graph';

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
            <HierarchyNodeRow>
                <div className="px-4 rounded-md bg-neutral-100 flex-1 text-neutral-500 text-left overflow-hidden whitespace-nowrap overflow-ellipsis">
                    other {(node.children?.length ?? 0) - groups.length - activeChildren.length}{' '}
                    models
                </div>
            </HierarchyNodeRow>
        </div>
    );
}
