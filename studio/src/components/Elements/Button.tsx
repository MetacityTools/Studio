import clsx from 'clsx';
import React from 'react';

import { Input } from './Input';

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
    unstyled?: boolean;
}) {
    return (
        <>
            <label
                htmlFor={props.id}
                className={clsx(
                    !props.unstyled &&
                        'px-4 py-2 rounded-md transition-colors cursor-pointer bg-blue-100 text-blue-900 hover:bg-blue-200 flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis text-sm flex flex-row items-center'
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
