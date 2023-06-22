import React from 'react';
import { BsChevronRight } from 'react-icons/bs';

import { MetadataNode } from '@utils/types';

import { useStyle } from '@viewer/ViewerContext';

import {
    HierarchyBracketsButton,
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNode,
    HierarchyNodeGroup,
    HierarchyNodeGroupChildren,
} from '@elements/Hierarchy';

export function MetadataCategory(props: { category: string; node: MetadataNode; depth: number }) {
    let { category, node, depth } = props;
    const [open, setOpen] = React.useState(false);
    const [style, keychain, setStyle] = useStyle();

    const categories: string[] = [category];
    while (node.children && Object.keys(node.children).length === 1) {
        const key = Object.keys(node.children)[0];
        categories.push(key);
        node = node.children[key];
    }

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    const handleUseStyle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setStyle(node);
        e.stopPropagation();
    };

    const isCategory = node.children && Object.keys(node.children).length > 0;

    return (
        <HierarchyNodeGroup>
            <HierarchyNode hoverable>
                {isCategory && (
                    <HierarchyChevronButton
                        open={open}
                        onClick={handleOpen}
                        title="Show subcategories"
                        inheritStyles
                    />
                )}
                {!isCategory && <HierarchyBracketsButton inheritStyles onClick={handleUseStyle} />}
                <HierarchyMainButton
                    inheritStyles
                    onClick={isCategory ? handleOpen : handleUseStyle}
                >
                    <MetadataCategoryButtonContent categories={categories} />
                </HierarchyMainButton>
            </HierarchyNode>
            {open && <MetadataCategoryChildren node={node} depth={depth + 1} />}
        </HierarchyNodeGroup>
    );
}

export function MetadataCategoryButtonContent(props: { categories: string[] }) {
    let { categories } = props;
    return (
        <>
            {categories.map((category, index) => {
                return (
                    <React.Fragment key={index}>
                        <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                            {category}
                        </span>
                        {index < categories.length - 1 && (
                            <BsChevronRight className="mx-2 text-xs" />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
}

export function MetadataCategoryChildren(props: { node: MetadataNode; depth: number }) {
    const { node, depth } = props;
    return (
        <HierarchyNodeGroupChildren>
            {node.children &&
                Object.entries(node.children).map(([key, value]) => {
                    return <MetadataCategory category={key} key={key} node={value} depth={depth} />;
                })}
        </HierarchyNodeGroupChildren>
    );
}
