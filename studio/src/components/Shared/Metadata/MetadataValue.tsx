import React from 'react';

import { MetadataNode } from '@utils/types';

import {
    HierarchyBracketsButton,
    HierarchyMainButton,
    HierarchyNode,
    HierarchyNodeGroup,
} from '@elements/Hierarchy';

import { MetadataTitle } from './MetadataTitle';

interface MetadataValueProps {
    categories: string[];
    node: MetadataNode;
    onValuePick: (value: MetadataNode) => void;
    depth?: number;
}

export function MetadataValue(props: MetadataValueProps) {
    const { categories, node, onValuePick, depth } = props;

    const handleUseStyle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onValuePick(node);
        e.stopPropagation();
    };

    return (
        <HierarchyNodeGroup>
            <HierarchyNode depth={depth}>
                <HierarchyBracketsButton inheritStyles onClick={handleUseStyle} />
                <HierarchyMainButton inheritStyles onClick={handleUseStyle}>
                    <MetadataTitle categories={categories} />
                </HierarchyMainButton>
            </HierarchyNode>
        </HierarchyNodeGroup>
    );
}
