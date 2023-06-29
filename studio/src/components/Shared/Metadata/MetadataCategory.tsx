import React from 'react';

import { MetadataNode } from '@utils/types';

import {
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNode,
    HierarchyNodeGroup,
    HierarchyNodeGroupChildren,
} from '@elements/Hierarchy';

import { MetadataNodeComponent } from './MetadataNode';
import { MetadataTitle } from './MetadataTitle';

interface MetadataCategoryProps {
    categories: string[];
    node: MetadataNode;
    onValuePick: (value: MetadataNode) => void;
}

export function MetadataCategory(props: MetadataCategoryProps) {
    const { categories } = props;
    const [open, setOpen] = React.useState(false);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    return (
        <HierarchyNodeGroup>
            <HierarchyNode hoverable>
                <HierarchyChevronButton
                    open={open}
                    onClick={handleOpen}
                    title="Show subcategories"
                    inheritStyles
                />
                <HierarchyMainButton inheritStyles onClick={handleOpen}>
                    <MetadataTitle categories={categories} />
                </HierarchyMainButton>
            </HierarchyNode>
            {open && <MetadataCategoryChildren {...props} />}
        </HierarchyNodeGroup>
    );
}

export function MetadataCategoryChildren(props: MetadataCategoryProps) {
    const { node, onValuePick } = props;

    if (node.children) {
        const sortedEntires = Object.entries(node.children).sort(([a], [b]) => a.localeCompare(b));
        return (
            <HierarchyNodeGroupChildren>
                {sortedEntires.map(([key, value]) => {
                    return (
                        <MetadataNodeComponent
                            onValuePick={onValuePick}
                            category={key}
                            node={value}
                            key={key}
                        />
                    );
                })}
            </HierarchyNodeGroupChildren>
        );
    }

    return null;
}
