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
                'text-xs last:rounded-r-md first:rounded-l-md transition-colors',
                props.active
                    ? 'text-green-500 bg-green-100 hover:bg-green-200'
                    : 'text-neutral-500 bg-neutral-200 hover:bg-neutral-300'
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

interface MenuInputProps {
    tipTitle?: string;
    tipPosition?: 'top' | 'left' | 'right' | 'bottom';
    label: string;
    onChange: (value: number) => void;
    value: number;
}

export function MenuInput(props: MenuInputProps) {
    return (
        <div className="flex flex-row items-center">
            <label className="text-xs text-neutral-600 mr-2">{props.label}</label>
            <input
                type="number"
                className="text-xs text-neutral-600 bg-neutral-200 rounded-md p-2 ml-2 w-16 text-right"
                onChange={(e) => props.onChange(parseFloat(e.target.value))}
                defaultValue={props.value}
            />
        </div>
    );
}

export function MenuGroup(props: { children: React.ReactNode }) {
    return <div className="flex flex-row rounded-md">{props.children}</div>;
}
