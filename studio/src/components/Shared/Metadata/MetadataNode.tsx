import { MetadataNode } from '@utils/types';

import { MetadataCategory } from './MetadataCategory';
import { MetadataValue } from './MetadataValue';

interface MetadataNodeComponentProps {
    onValuePick: (value: MetadataNode) => void;
    category: string;
    node: MetadataNode;
}

export function MetadataNodeComponent(props: MetadataNodeComponentProps) {
    let { category, onValuePick } = props;
    const { categories, node } = aggregateLabel(category, props.node);

    const isCategory = node.children && Object.keys(node.children).length > 0;
    const isValue = node.values !== undefined;

    return (
        <>
            {isCategory && (
                <MetadataCategory categories={categories} node={node} onValuePick={onValuePick} />
            )}
            {isValue && (
                <MetadataValue categories={categories} node={node} onValuePick={onValuePick} />
            )}
        </>
    );
}

function aggregateLabel(category: string, node: MetadataNode) {
    const categories: string[] = [category];
    while (node.children && Object.keys(node.children).length === 1) {
        const key = Object.keys(node.children)[0];
        categories.push(key);
        node = node.children[key];
    }
    return { categories, node };
}
