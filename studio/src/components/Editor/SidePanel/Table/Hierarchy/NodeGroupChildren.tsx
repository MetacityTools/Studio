import React from 'react';

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
    const [countVisible, setCountVisible] = React.useState(10);
    const groups = node.children?.filter(
        (child) => child instanceof GroupNodeClass
    ) as GroupNodeClass[];

    //const activeChildren: Node[] = [];
    //const nonActiveChildren: Node[] = [];
    //node.children?.forEach((child) => {
    //    if (
    //        child instanceof ModelNodeClass &&
    //        (isSelected(selectedModels, child) || child === nodeToMove || child === nodeToLink)
    //    )
    //        activeChildren.push(child);
    //    else nonActiveChildren.push(child);
    //});
    //const concatChildren = activeChildren.concat(nonActiveChildren);
    const concatChildren = node.children;

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
