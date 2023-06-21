import clsx from 'clsx';
import React from 'react';

import { Input } from './Input';

interface MenuButtonProps {
    children: React.ReactNode;
    tipTitle?: string;
    active?: boolean;
    onClick?: () => void;
}

export function getMenuButtonStyle(active?: boolean) {
    return clsx(
        'text-xs transition-colors outline-none focus:outline-none',
        'first:border-l last:border-r border-y last:rounded-r-md first:rounded-l-md',
        active
            ? 'text-amber-600 bg-amber-100 border-amber-300 hover:bg-amber-200 hover:border-amber-400'
            : 'text-neutral-600 bg-white hover:text-amber-600 hover:bg-amber-200 hover:border-amber-400'
    );
}

export function MenuButton(props: MenuButtonProps) {
    return (
        <button
            className={clsx(getMenuButtonStyle(props.active || false), props.onClick && 'p-2')}
            onClick={props.onClick}
            title={props.tipTitle}
        >
            {props.children}
        </button>
    );
}

export function MenuGroup(props: { children: React.ReactNode; column?: boolean }) {
    return (
        <div
            className={clsx(
                'flex transition-shadow',
                props.column ? 'flex-col rounded-l' : 'flex-row rounded-md'
            )}
        >
            {props.children}
        </div>
    );
}

export function Button(props: {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className="px-4 py-2 rounded-md transition-colors bg-blue-100 text-blue-900 enabled:hover:bg-blue-200 overflow-hidden whitespace-nowrap overflow-ellipsis text-sm outline-none flex flex-row items-center disabled:opacity-50 disabled:cursor-default"
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
}

export function ButtonFileInput(props: {
    children: React.ReactNode;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    multiple?: boolean;
    id: string;
    className?: string;
}) {
    return (
        <>
            <label
                htmlFor={props.id}
                className={clsx(
                    'cursor-pointer',
                    props.className
                        ? props.className
                        : 'px-4 py-2 rounded-md transition-colors bg-blue-100 text-blue-900 hover:bg-blue-200 flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis text-sm flex flex-row items-center'
                )}
            >
                {props.children}
            </label>
            <Input
                className="hidden"
                type="file"
                onChange={props.onChange}
                id={props.id}
                multiple={props.multiple}
            />
        </>
    );
}
