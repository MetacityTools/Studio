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
import { MetadataMenuPickFunciton } from './MetadataValue';

interface MetadataCategoryProps {
    categories: string[];
    node: MetadataNode;
    onValuePick: MetadataMenuPickFunciton;
    depth?: number;
    initialOpen?: boolean;
}

export function MetadataCategory(props: MetadataCategoryProps) {
    const { categories } = props;
    const [open, setOpen] = React.useState(props.initialOpen || false);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    return (
        <HierarchyNodeGroup>
            <HierarchyNode depth={props.depth}>
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
