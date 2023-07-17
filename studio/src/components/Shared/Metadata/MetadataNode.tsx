import React from 'react';

import { MetadataNode } from '@utils/types';

import {
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNode,
    HierarchyNodeGroup,
    HierarchyTitle,
} from '@elements/Hierarchy';

import { MetadataCategoryChildren } from './MetadataCategory';
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
    const [open, setOpen] = React.useState(props.initialOpen || false);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    const isCategory = node.children && node.children.size > 0;
    const isValue = node.values !== undefined;

    return (
        <HierarchyNodeGroup>
            {(isCategory || isValue) && (
                <HierarchyNode depth={props.depth}>
                    <HierarchyChevronButton
                        open={open}
                        onClick={handleOpen}
                        title="Show subcategories"
                    />
                    <HierarchyMainButton onClick={handleOpen}>
                        <HierarchyTitle categories={categories} />
                    </HierarchyMainButton>
                </HierarchyNode>
            )}
            {isCategory && open && (
                <MetadataCategoryChildren
                    node={node}
                    onValuePick={onValuePick}
                    categories={categories}
                    depth={depth}
                />
            )}
            {isValue && open && (
                <MetadataValue node={node} onValuePick={onValuePick} depth={depth} />
            )}
        </HierarchyNodeGroup>
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
