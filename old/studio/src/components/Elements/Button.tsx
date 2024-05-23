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
            className={clsx(
                'px-4 py-2 overflow-hidden whitespace-nowrap overflow-ellipsis outline-none flex flex-row items-center disabled:opacity-50 disabled:cursor-default',
                'mc-text',
                'hover:bg-neutral-200 focus:bg-neutral-200 active:bg-neutral-300',
                'dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:active:bg-neutral-600'
            )}
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
    accept?: string;
}) {
    return (
        <>
            <label
                htmlFor={props.id}
                className={clsx(
                    'cursor-pointer',
                    props.className
                        ? props.className
                        : clsx(
                              'px-4 py-2 overflow-hidden whitespace-nowrap overflow-ellipsis outline-none flex flex-row items-center disabled:opacity-50 disabled:cursor-default',
                              'mc-text',
                              'hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-300',
                              'dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:active:bg-neutral-600'
                          )
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
                accept={props.accept}
            />
        </>
    );
}
