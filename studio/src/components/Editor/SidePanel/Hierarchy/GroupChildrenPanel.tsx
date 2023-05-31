import { ModelGroupNode, ModelNode } from '@utils/hierarchy/graph';

import { HierarchyNodeRow } from '@elements/Hierarchy';

import { GroupNodePanel, GroupNodePanelProps } from './GroupPanel';
import { ModelNodePanel } from './ModelPanel';

export function GroupChildrenPanel(props: GroupNodePanelProps) {
    const { model, submodels, node } = props;

    return (
        <div className="mt-1 pl-8 space-y-1">
            {node.children?.map(
                (child) =>
                    child instanceof ModelGroupNode && (
                        <GroupNodePanel
                            key={child.uuid}
                            model={model}
                            submodels={submodels}
                            node={child}
                        />
                    )
            )}
            {node.children?.map(
                (child) =>
                    child instanceof ModelNode && (
                        <ModelNodePanel
                            key={child.uuid}
                            model={model}
                            submodels={submodels}
                            node={child}
                        />
                    )
            )}
            <HierarchyNodeRow>
                <div className="px-4 rounded-md bg-neutral-100 flex-1 text-neutral-500 text-right">
                    contains {node.children?.length} children parts
                </div>
            </HierarchyNodeRow>
        </div>
    );
}
