import { MetadataNode } from '@utils/types';

import { MetadataCategory } from './MetadataCategory';
import { MetadataMenuPickFunciton, MetadataValue } from './MetadataValue';

interface MetadataNodeComponentProps {
    onValuePick: MetadataMenuPickFunciton;
    category: string;
    node: MetadataNode;
    depth?: number;
    initialOpen?: boolean;
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
                    initialOpen={props.initialOpen}
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
    while (node.children && node.children.size === 1 && !node.values) {
        const key = node.children.keys().next().value;
        categories.push(key);
        node = node.children.get(key)!;
    }
    return { categories, node };
}
