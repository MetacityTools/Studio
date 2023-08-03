import { MetadataNode } from 'data/types';

import { HierarchyNodeGroupChildren } from '@elements/Hierarchy';

import { MetadataNodeComponent } from './MetadataNode';
import { MetadataMenuPickFunciton } from './MetadataValue';

interface MetadataCategoryProps {
    categories: string[];
    node: MetadataNode;
    onValuePick: MetadataMenuPickFunciton;
    depth?: number;
}

export function MetadataCategoryChildren(props: MetadataCategoryProps) {
    const { node, onValuePick, depth } = props;

    if (node.children) {
        const sortedEntires = [...node.children].sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
        return (
            <HierarchyNodeGroupChildren>
                {sortedEntires.map(([key, value]) => {
                    return (
                        <MetadataNodeComponent
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
