import React from 'react';

import { MetadataNode } from '@utils/types';

import {
    HierarchyBracketsButton,
    HierarchyChevronButton,
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
    const [displayCount, setDisplayCount] = React.useState(10);
    const [open, setOpen] = React.useState(false);

    const handleUseStyle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onValuePick(node);
        e.stopPropagation();
    };

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    const unique = Array.from(new Set(node.values));

    return (
        <HierarchyNodeGroup>
            <HierarchyNode depth={depth}>
                <HierarchyChevronButton inheritStyles onClick={handleOpen} open={open} />
                <HierarchyMainButton inheritStyles onClick={handleOpen}>
                    <MetadataTitle categories={categories} />
                </HierarchyMainButton>
            </HierarchyNode>

            {open &&
                unique.slice(0, displayCount).map((value, i) => (
                    <HierarchyNode
                        key={value}
                        depth={(depth !== undefined && depth + 1) || undefined}
                    >
                        <HierarchyBracketsButton inheritStyles onClick={handleUseStyle} />
                        <HierarchyMainButton inheritStyles onClick={handleUseStyle}>
                            {value}
                        </HierarchyMainButton>
                    </HierarchyNode>
                ))}

            {open && unique.length > displayCount && (
                <HierarchyNode depth={(depth !== undefined && depth + 1) || undefined}>
                    <button
                        onClick={() =>
                            setDisplayCount((count) => Math.min(count + 10, unique.length))
                        }
                        className="text-neutral-300 px-2"
                    >
                        {unique.length - displayCount} more values
                    </button>
                </HierarchyNode>
            )}
        </HierarchyNodeGroup>
    );
}
