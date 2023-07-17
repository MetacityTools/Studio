import React from 'react';

import { StyleNode } from '@utils/types';

import {
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNode,
    HierarchyNodeGroup,
    HierarchyStyleButton,
    HierarchyTitle,
} from '@elements/Hierarchy';

import { StyleCategoryChildren } from './StyleCategory';

export type StyleMenuPickFunciton = (node: StyleNode) => void;

interface StyleNodeComponentProps {
    onValuePick: StyleMenuPickFunciton;
    category: string;
    node: StyleNode;
    depth?: number;
    initialOpen?: boolean;
}

export function StyleNodeComponent(props: StyleNodeComponentProps) {
    let { category, onValuePick, depth } = props;
    const { categories, node } = aggregateLabel(category, props.node);
    const [open, setOpen] = React.useState(props.initialOpen || false);

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    const handleUseStyle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onValuePick(node);
        e.stopPropagation();
    };

    const isCategory = node.children && Object.keys(node.children).length > 0;
    const isValue = node.style !== undefined;

    return (
        <HierarchyNodeGroup>
            {isCategory && (
                <>
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
                    {isValue && open && (
                        <HierarchyNode depth={(depth !== undefined && depth + 1) || undefined}>
                            <HierarchyStyleButton onClick={handleUseStyle} />
                            <HierarchyMainButton onClick={handleUseStyle}>
                                Apply Style
                            </HierarchyMainButton>
                        </HierarchyNode>
                    )}
                    {isCategory && open && (
                        <StyleCategoryChildren
                            node={node}
                            onValuePick={onValuePick}
                            categories={categories}
                            depth={depth}
                        />
                    )}
                </>
            )}
            {!isCategory && isValue && (
                <>
                    <HierarchyNode depth={props.depth}>
                        <HierarchyStyleButton onClick={handleUseStyle} />
                        <HierarchyMainButton onClick={handleUseStyle}>
                            <HierarchyTitle categories={categories} />
                        </HierarchyMainButton>
                    </HierarchyNode>
                </>
            )}
        </HierarchyNodeGroup>
    );
}

function aggregateLabel(category: string, node: StyleNode) {
    const categories: string[] = [category];
    let keys: string[];
    while (node.children && (keys = Object.keys(node.children)).length === 1 && !node.style) {
        const key = keys[0];
        categories.push(key);
        node = node.children[key];
    }
    return { categories, node };
}
