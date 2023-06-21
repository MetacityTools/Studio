import clsx from 'clsx';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { FiChevronRight } from 'react-icons/fi';
import { VscJson } from 'react-icons/vsc';

import { MetadataNode, MetadataType } from '@utils/types';

import { MetadataValueMixed, MetadataValueNumbers, MetadataValueStrings } from './MetadataValues';

export function MetadataCategory(props: { category: string; node: MetadataNode; depth: number }) {
    let { category, node, depth } = props;
    const [open, setOpen] = React.useState(false);

    const categories: string[] = [category];
    while (node.children && Object.keys(node.children).length === 1) {
        const key = Object.keys(node.children)[0];
        categories.push(key);
        node = node.children[key];
    }

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <MetadataCategoryButton node={node} depth={depth} open={open} onClick={handleToggle}>
                <MetadataCategoryButtonContent categories={categories} />
            </MetadataCategoryButton>
            {open && <MetadataCategoryChildren node={node} depth={depth + 1} />}
            {open && <MetadataCategoryValues node={node} />}
        </>
    );
}

export function MetadataCategoryButton(props: {
    children?: React.ReactNode;
    node: MetadataNode;
    depth: number;
    open?: boolean;
    onClick?: () => void;
}) {
    const { children, node, depth, open, onClick } = props;
    return (
        <button
            className="py-1 flex flex-row items-center hover:text-amber-800 hover:bg-amber-300 transition-colors outline-none"
            onClick={onClick}
            style={{
                paddingLeft: `calc(${depth * 2}rem + 1rem)`,
                paddingRight: `1rem`,
            }}
        >
            {node.children && (
                <div className="w-4">
                    <FiChevronRight
                        className={clsx(
                            'w-4 h-4 transition-all flex-0',
                            open && 'transform rotate-90'
                        )}
                    />
                </div>
            )}
            {!node.children && (
                <div className="w-4">
                    <VscJson className="w-4 h-4" />
                </div>
            )}
            <div className="px-2 flex flex-row items-center w-full">{children}</div>
        </button>
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
        <>
            {node.children &&
                Object.entries(node.children).map(([key, value]) => {
                    if (value.children && Object.keys(value.children).length === 1) {
                    }

                    return <MetadataCategory category={key} key={key} node={value} depth={depth} />;
                })}
        </>
    );
}

export function MetadataCategoryValues(props: { node: MetadataNode }) {
    const { node } = props;
    if (!node.values) return null;

    return (
        <>
            {node.values.type === MetadataType.STRING && (
                <MetadataValueStrings values={props.node.values} />
            )}
            {node.values.type === MetadataType.NUMBER && <MetadataValueNumbers node={props.node} />}
            {node.values.type === MetadataType.MIXED && (
                <MetadataValueMixed values={props.node.values} />
            )}
        </>
    );
}
