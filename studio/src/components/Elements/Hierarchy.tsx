import clsx from 'clsx';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { FiChevronRight } from 'react-icons/fi';
import { VscJson } from 'react-icons/vsc';

import { colorLightActive, colorVividActive, colorVividBase } from './Colors';

function getNodeBackground(active: boolean, light?: boolean, inherit?: boolean) {
    if (inherit) return 'bg-transparent border-inherit text-inherit bg-inherit';
    if (active) return colorVividActive;
    if (light) return colorLightActive;
    return colorVividBase;
}

export type ButtonHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

interface HierarchyButtonBase {
    onClick?: ButtonHandler;
    title?: string;
    active?: boolean;
    light?: boolean;
    inheritStyles?: boolean;
}

interface HierarchyButtonProps extends HierarchyButtonBase {
    children: React.ReactNode;
    disabled?: boolean;
}

interface HierarchyChevronButtonProps extends HierarchyButtonBase {
    open: boolean;
}

export function HierarchyChevronButton(props: HierarchyChevronButtonProps) {
    return (
        <button
            className={clsx(
                'outline-none',
                'px-2 py-2',
                getNodeBackground(
                    props.active ?? false,
                    props.light ?? false,
                    props.inheritStyles ?? false
                )
            )}
            onClick={props.onClick}
            title={props.title}
        >
            <FiChevronRight
                className={clsx(
                    'w-4 h-4 transition-transform',
                    props.open && 'transform rotate-90'
                )}
            />
        </button>
    );
}

export function HierarchyBracketsButton(props: HierarchyButtonBase) {
    return (
        <button
            className={clsx(
                'outline-none',
                'px-2 py-2',
                getNodeBackground(
                    props.active ?? false,
                    props.light ?? false,
                    props.inheritStyles ?? false
                )
            )}
            onClick={props.onClick}
            title={props.title}
        >
            <VscJson className={clsx('w-4 h-4')} />
        </button>
    );
}

interface HierarchyMainButtonProps extends HierarchyButtonProps {
    padded?: boolean;
}

export function HierarchyMainButton(props: HierarchyMainButtonProps) {
    return (
        <button
            className={clsx(
                'outline-none',
                props.padded ? 'px-4' : 'px-2',
                'flex-1 text-left flex flex-row items-center',
                'text-ellipsis overflow-hidden whitespace-nowrap',
                getNodeBackground(
                    props.active ?? false,
                    props.light ?? false,
                    props.inheritStyles ?? false
                )
            )}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

interface HierarchyNodeProps {
    hoverable?: boolean;
    children: React.ReactNode;
    active?: boolean;
    depth?: number;
}

export function HierarchyNode(props: HierarchyNodeProps) {
    return (
        <div
            className={clsx(
                'flex flex-row justify-between items-center hover:bg-neutral-100',
                props.hoverable
            )}
            style={{
                paddingLeft: `${props.depth ?? 0}rem`,
            }}
        >
            {props.children}
        </div>
    );
}

interface HierarchyNodeGroupProps {
    children: React.ReactNode;
}

export function HierarchyNodeGroup(props: HierarchyNodeGroupProps) {
    return <div className="flex flex-col">{props.children}</div>;
}

export function HierarchyNodeGroupChildren(props: HierarchyNodeGroupProps) {
    return <div>{props.children}</div>;
}

export function HierarchyTitle(props: { categories: string[] }) {
    let { categories } = props;
    return (
        <>
            {categories.map((category, index) => {
                return (
                    <React.Fragment key={index}>
                        <span
                            className="overflow-ellipsis overflow-hidden whitespace-nowrap"
                            title={category}
                        >
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
