import React from 'react';

import { GroupNode as GroupNodeClass, ModelNode as ModelNodeClass, Node } from '@utils/utils';

import { GroupNode, GroupNodeProps } from './NodeGroup';
import { ModelNode } from './NodeModel';

interface GroupNodeChildrenProps extends GroupNodeProps {
    nodeToMove?: Node;
    nodeToLink?: Node;
}

export function GroupNodeChildren(props: GroupNodeChildrenProps) {
    const { node, nodeToMove, nodeToLink, selectedModels } = props;
    const [countVisible, setCountVisible] = React.useState(10);
    const groups = node.children?.filter(
        (child) => child instanceof GroupNodeClass
    ) as GroupNodeClass[];

    const concatChildren = node.children?.filter(
        (child) => child instanceof ModelNodeClass
    ) as ModelNodeClass[];

    if (groups.length === 0 && concatChildren.length === 0)
        return <div className="text-neutral-400 pl-10">No models</div>;

    return (
        <div className="mt-1 pl-8 space-y-1">
            {groups.map((child) => (
                <GroupNode key={child.uuid} selectedModels={selectedModels} node={child} />
            ))}
            {concatChildren
                .slice(0, countVisible)
                .map(
                    (child) =>
                        child instanceof ModelNodeClass && (
                            <ModelNode
                                key={child.uuid}
                                selectedModels={selectedModels}
                                node={child}
                            />
                        )
                )}
            {countVisible < concatChildren.length && (
                <div
                    className="text-neutral-400 pl-10 cursor-pointer hover:text-neutral-500"
                    onClick={() => setCountVisible(countVisible + 10)}
                >
                    + {concatChildren.length - countVisible} more models
                </div>
            )}
        </div>
    );
}
