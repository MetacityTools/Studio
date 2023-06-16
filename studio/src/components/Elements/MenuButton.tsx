import clsx from 'clsx';
import React from 'react';

interface MenuButtonProps {
    children: React.ReactNode;
    tipTitle?: string;
    active?: boolean;
    column?: boolean;
    onClick?: () => void;
}

export function MenuButton(props: MenuButtonProps) {
    return (
        <button
            className={clsx(
                'text-xs transition-colors outline-none focus:outline-none',
                !props.column &&
                    'first:border-l last:border-r border-y last:rounded-r-md first:rounded-l-md',
                props.column &&
                    'first:border-t last:border-b border-l last:rounded-bl-md first:rounded-tl-md',
                props.active
                    ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                    : 'text-neutral-600 bg-white hover:text-amber-600 hover:bg-amber-200',
                props.onClick && 'p-2'
            )}
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
