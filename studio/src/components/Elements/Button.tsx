import React from 'react';

export function Button(props: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className="py-2 px-4 hover:bg-neutral-300 rounded-md transition-colors border"
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
