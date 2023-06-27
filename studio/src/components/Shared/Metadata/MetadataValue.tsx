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
}

export function MetadataValue(props: MetadataValueProps) {
    const { categories, node, onValuePick } = props;

    const handleUseStyle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onValuePick(node);
        e.stopPropagation();
    };

    return (
        <HierarchyNodeGroup>
            <HierarchyNode hoverable>
                <HierarchyBracketsButton inheritStyles onClick={handleUseStyle} />
                <HierarchyMainButton inheritStyles onClick={handleUseStyle}>
                    <MetadataTitle categories={categories} />
                </HierarchyMainButton>
            </HierarchyNode>
        </HierarchyNodeGroup>
    );
}
