import clsx from 'clsx';
import React from 'react';

interface MenuButtonProps {
    children: React.ReactNode;
    tipTitle?: string;
    active?: boolean;
    onClick?: () => void;
}

export function MenuButton(props: MenuButtonProps) {
    return (
        <button
            className={clsx(
                'text-xs last:rounded-r-md first:rounded-l-md transition-colors outline-none focus:outline-none border-y first:border-l last:border-r p-2',
                props.active
                    ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                    : 'text-neutral-600 bg-white hover:bg-neutral-300'
            )}
            onClick={props.onClick}
            title={props.tipTitle}
        >
            {props.children}
        </button>
    );
}

export function MenuGroup(props: { children: React.ReactNode; row?: boolean; column?: boolean }) {
    return (
        <div
            className={clsx(
                'flex rounded-md shadow-even',
                (!props.column && 'flex-row') || (!props.row && 'flex-col space-y-2')
            )}
        >
            {props.children}
        </div>
    );
}
