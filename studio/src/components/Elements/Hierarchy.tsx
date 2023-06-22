import clsx from 'clsx';
import { FiChevronRight } from 'react-icons/fi';
import { VscJson } from 'react-icons/vsc';

import {
    colorLightActive,
    colorVividActive,
    colorVividActiveBorder,
    colorVividBase,
    colorVividBaseBorder,
} from './colors';

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

export function HierarchyButton(props: HierarchyButtonProps) {
    const disabled = props.disabled ?? false;
    return (
        <button
            className={clsx(
                'px-4 py-2 border-y last:border-r last:rounded-r',
                getNodeBackground(
                    props.active ?? false,
                    props.light ?? false,
                    props.inheritStyles ?? false
                )
            )}
            onClick={props.onClick}
            title={props.title}
            disabled={disabled}
        >
            {props.children}
        </button>
    );
}

interface HierarchyChevronButtonProps extends HierarchyButtonBase {
    open: boolean;
}

export function HierarchyChevronButton(props: HierarchyChevronButtonProps) {
    return (
        <button
            className={clsx(
                'px-2 py-2 rounded-l border-y border-l',
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
                'px-2 py-2 rounded-l border-y border-l',
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
                props.padded ? 'px-4' : 'px-2',
                'flex-1 text-left first:rounded-l last:rounded-r border-y first:border-l last:border-r last:rounded-r flex flex-row items-center',
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
}

export function HierarchyNode(props: HierarchyNodeProps) {
    return (
        <div
            className={clsx(
                'flex flex-row justify-between items-center',
                props.hoverable
                    ? props.active
                        ? colorVividActive
                        : colorVividBase
                    : props.active
                    ? colorVividActiveBorder
                    : colorVividBaseBorder
            )}
        >
            {props.children}
        </div>
    );
}

interface HierarchyNodeGroupProps {
    children: React.ReactNode;
}

export function HierarchyNodeGroup(props: HierarchyNodeGroupProps) {
    return <div className="flex flex-col rounded-md">{props.children}</div>;
}

export function HierarchyNodeGroupChildren(props: HierarchyNodeGroupProps) {
    return <div className="mt-1 pl-8 space-y-1">{props.children}</div>;
}
