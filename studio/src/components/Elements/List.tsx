import clsx from 'clsx';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { VscJson, VscSymbolColor } from 'react-icons/vsc';

export type ButtonHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

interface ListButtonBase {
    onClick?: ButtonHandler;
    title?: string;
}

interface ListBaseButtonProps extends ListButtonBase {
    children: React.ReactNode;
    disabled?: boolean;
}

function ListBaseButton(props: ListBaseButtonProps & { children: React.ReactNode }) {
    return (
        <button
            className="outline-none px-2 py-2 hierarchy-part"
            onClick={props.onClick}
            title={props.title}
        >
            {props.children}
        </button>
    );
}

interface ChevronButtonProps extends ListButtonBase {
    open: boolean;
}

export function ChevronButton(props: ChevronButtonProps) {
    return (
        <ListBaseButton {...props}>
            <FiChevronRight className={clsx('w-4 h-4', props.open && 'transform rotate-90')} />
        </ListBaseButton>
    );
}

export function BracketsButton(props: ListButtonBase) {
    return (
        <ListBaseButton {...props}>
            <VscJson className="w-4 h-4" />
        </ListBaseButton>
    );
}

export function StyleButton(props: ListButtonBase) {
    return (
        <ListBaseButton {...props}>
            <VscSymbolColor className="w-4 h-4" />
        </ListBaseButton>
    );
}

interface ListButtonProps extends ListBaseButtonProps {
    padded?: boolean;
    className?: string;
}

export function ListButton(props: ListButtonProps) {
    return (
        <button
            className={clsx(
                'outline-none',
                props.padded ? 'px-4' : 'px-2',
                'flex-1 text-left flex flex-row items-center',
                'text-ellipsis overflow-hidden whitespace-nowrap',
                'hierarchy-part',
                props.className
            )}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

interface ListItemProps {
    hoverable?: boolean;
    children: React.ReactNode;
    active?: boolean;
    depth?: number;
}

export function ListItem(props: ListItemProps) {
    return (
        <div
            className={clsx(
                'flex flex-row justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-700',
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

interface ListGroupGroupProps {
    children: React.ReactNode;
}

export function ListGroup(props: ListGroupGroupProps) {
    return <div className="flex flex-col">{props.children}</div>;
}

export function ListGroupChildren(props: ListGroupGroupProps) {
    return <div>{props.children}</div>;
}
