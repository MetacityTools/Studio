import { StyleNode } from '@utils/types';

import { HierarchyNodeGroupChildren } from '@elements/Hierarchy';

import { StyleMenuPickFunciton, StyleNodeComponent } from './StyleNode';

interface StyleNodeProps {
    categories: string[];
    node: StyleNode;
    onValuePick: StyleMenuPickFunciton;
    depth?: number;
}

export function StyleNodeChildren(props: StyleNodeProps) {
    const { node, onValuePick, depth } = props;

    if (node.children) {
        const sortedEntires = Object.entries(node.children).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
        );
        return (
            <HierarchyNodeGroupChildren>
                {sortedEntires.map(([key, value]) => {
                    return (
                        <StyleNodeComponent
                            onValuePick={onValuePick}
                            category={key}
                            node={value}
                            key={key}
                            depth={(depth !== undefined && depth + 1) || undefined}
                        />
                    );
                })}
            </HierarchyNodeGroupChildren>
        );
    }

    return null;
}
