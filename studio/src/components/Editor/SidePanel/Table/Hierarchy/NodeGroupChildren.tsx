import { GroupNode as GroupNodeClass, ModelNode as ModelNodeClass } from '@utils/hierarchy/graph';

import { HierarchyNodeRow } from '@elements/Hierarchy';

import { GroupNode, GroupNodeProps } from './NodeGroup';
import { ModelNode } from './NodeModel';

export function GroupNodeChildren(props: GroupNodeProps) {
    const { model, submodels, node } = props;

    return (
        <div className="mt-1 pl-8 space-y-1">
            {node.children?.map(
                (child) =>
                    child instanceof GroupNodeClass && (
                        <GroupNode
                            key={child.uuid}
                            model={model}
                            submodels={submodels}
                            node={child}
                        />
                    )
            )}
            {node.children?.map(
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
                <div className="px-4 rounded-md bg-neutral-100 flex-1 text-neutral-500 text-right overflow-hidden whitespace-nowrap overflow-ellipsis">
                    contains {node.children?.length} children parts
                </div>
            </HierarchyNodeRow>
        </div>
    );
}
