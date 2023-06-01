import React from 'react';

import { Input } from './Input';

export function Button(props: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className="px-4 py-2 rounded-md transition-colors bg-blue-100 text-blue-900 hover:bg-blue-200 overflow-hidden whitespace-nowrap overflow-ellipsis text-sm outline-none"
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export function ButtonFileInput(props: {
    children: React.ReactNode;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    id: string;
}) {
    return (
        <>
            <label
                htmlFor={props.id}
                className="px-4 py-2 rounded-md transition-colors cursor-pointer bg-blue-100 text-blue-900 hover:bg-blue-200 flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis text-sm"
            >
                {props.children}
            </label>
            <Input className="hidden" type="file" onChange={props.onChange} id={props.id} />
        </>
    );
}
