import { MetadataNode } from '@utils/types';

import { MetadataCategory } from './MetadataCategory';
import { MetadataValue } from './MetadataValue';

interface MetadataNodeComponentProps {
    onValuePick: (value: MetadataNode) => void;
    category: string;
    node: MetadataNode;
    depth?: number;
}

export function MetadataNodeComponent(props: MetadataNodeComponentProps) {
    let { category, onValuePick, depth } = props;
    const { categories, node } = aggregateLabel(category, props.node);

    const isCategory = node.children && node.children.size > 0;
    const isValue = node.values !== undefined;

    return (
        <>
            {isCategory && (
                <MetadataCategory
                    categories={categories}
                    node={node}
                    onValuePick={onValuePick}
                    depth={depth}
                />
            )}
            {isValue && (
                <MetadataValue
                    categories={categories}
                    node={node}
                    onValuePick={onValuePick}
                    depth={depth}
                />
            )}
        </>
    );
}

function aggregateLabel(category: string, node: MetadataNode) {
    const categories: string[] = [category];
    while (node.children && Object.keys(node.children).length === 1) {
        const key = Object.keys(node.children)[0];
        categories.push(key);
        node = node.children.get(key)!;
    }
    return { categories, node };
}
