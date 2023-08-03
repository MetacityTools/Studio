import { Style } from 'data/types';
import React from 'react';

import {
    ChevronButton,
    ListButton,
    ListGroup,
    ListGroupChildren,
    ListItem,
    StyleButton,
} from '@elements/List';
import { TitleChain } from '@elements/TitleChain';

export type StyleMenuPickFunciton = (node: Style) => void;

interface StyleItemProps {
    onValuePick: StyleMenuPickFunciton;
    category: string;
    node: Style;
    depth?: number;
    initialOpen?: boolean;
}

export function StyleItem(props: StyleItemProps) {
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

    const hasChildren = node.children && Object.keys(node.children).length > 0;
    const hasValues = node.style !== undefined;
    const children = Object.entries(node.children ?? {}).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
    );

    return (
        <ListGroup>
            {hasChildren && (
                <>
                    <ListItem depth={props.depth}>
                        <ChevronButton
                            open={open}
                            onClick={handleOpen}
                            title="Show subcategories"
                        />

                        <ListButton onClick={handleOpen}>
                            <TitleChain categories={categories} />
                        </ListButton>
                    </ListItem>
                    {hasValues && open && (
                        <ListItem depth={(depth !== undefined && depth + 1) || undefined}>
                            <StyleButton onClick={handleUseStyle} />
                            <ListButton onClick={handleUseStyle}>Apply Style</ListButton>
                        </ListItem>
                    )}
                    {hasChildren && open && (
                        <ListGroupChildren>
                            {children.map(([key, value]) => {
                                return (
                                    <StyleItem
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
                </>
            )}
            {!hasChildren && hasValues && (
                <ListItem depth={props.depth}>
                    <StyleButton onClick={handleUseStyle} />
                    <ListButton onClick={handleUseStyle}>
                        <TitleChain categories={categories} />
                    </ListButton>
                </ListItem>
            )}
        </ListGroup>
    );
}

function aggregateLabel(category: string, node: Style) {
    const categories: string[] = [category];
    let keys: string[];
    while (node.children && (keys = Object.keys(node.children)).length === 1 && !node.style) {
        const key = keys[0];
        categories.push(key);
        node = node.children[key];
    }
    return { categories, node };
}
