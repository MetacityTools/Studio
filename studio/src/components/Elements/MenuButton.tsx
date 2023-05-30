import clsx from 'clsx';
import React from 'react';

import { Tooltip } from './Tooltip';

interface MenuButtonProps {
    children: React.ReactNode;
    tipTitle?: string;
    tipPosition?: 'top' | 'left' | 'right' | 'bottom';
    active?: boolean;
    onClick?: () => void;
}

export function MenuButton(props: MenuButtonProps) {
    return (
        <button
            className={clsx(
                'text-xs last:rounded-r-md first:rounded-l-md transition-colors outline-none focus:outline-none',
                props.active
                    ? 'text-green-600 bg-green-100 hover:bg-green-200'
                    : 'text-neutral-600 bg-white hover:bg-neutral-300'
            )}
            onClick={props.onClick}
        >
            {props.tipTitle && props.tipPosition ? (
                <Tooltip content={props.tipTitle} position={props.tipPosition}>
                    <div className="p-2">{props.children}</div>
                </Tooltip>
            ) : (
                <div className="p-2">{props.children}</div>
            )}
        </button>
    );
}

export function MenuGroup(props: { children: React.ReactNode; row?: boolean; column?: boolean }) {
    return (
        <div
            className={clsx(
                'flex rounded-md shadow-even border',
                (!props.column && 'flex-row') || (!props.row && 'flex-col space-y-2')
            )}
        >
            {props.children}
        </div>
    );
}
