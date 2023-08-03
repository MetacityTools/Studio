import React from 'react';

import { ChevronButton, ListButton, ListGroup, ListGroupChildren, ListItem } from '@elements/List';
import { TitleChain } from '@elements/TitleChain';

import { Metadata } from '@data/types';

import { MetadataValue } from './MetadataValue';

interface MetadataItemProps {
    onValuePick: (node: Metadata, value: any) => void;
    category: string;
    node: Metadata;
    depth?: number;
    initialOpen?: boolean;
}

export function MetadataItem(props: MetadataItemProps) {
    let { category, onValuePick, depth } = props;
    const [open, setOpen] = React.useState(props.initialOpen || false);

    const { categories, node } = aggregateLabel(category, props.node);
    const hasValues = node.values !== undefined;
    const hasChildren = node.children && node.children.size > 0;
    const children = [...(node.children ?? [])].sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    return (
        <ListGroup>
            {(hasChildren || hasValues) && (
                <ListItem depth={props.depth}>
                    <ChevronButton open={open} onClick={handleOpen} title="Show subcategories" />
                    <ListButton onClick={handleOpen}>
                        <TitleChain categories={categories} />
                    </ListButton>
                </ListItem>
            )}
            {hasChildren && open && (
                <ListGroupChildren>
                    {children.map(([key, value]) => {
                        return (
                            <MetadataItem
                                onValuePick={onValuePick}
                                category={key}
                                node={value}
                                key={key}
                                depth={(depth !== undefined && depth + 1) || undefined}
                            />
                        );
                    })}
                </ListGroupChildren>
            )}
            {hasValues && open && (
                <MetadataValue node={node} onValuePick={onValuePick} depth={depth} />
            )}
        </ListGroup>
    );
}

function aggregateLabel(category: string, node: Metadata) {
    const categories: string[] = [category];
    while (node.children && node.children.size === 1 && !node.values) {
        const key = node.children.keys().next().value;
        categories.push(key);
        node = node.children.get(key)!;
    }
    return { categories, node };
}
