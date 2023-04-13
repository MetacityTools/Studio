import React from 'react';

export function MenuButton(props: { children: React.ReactNode }) {
    return (
        <div className="text-xs rounded-sm bg-neutral-900 hover:bg-neutral-800 cursor-pointer">
            {props.children}
        </div>
    );
}
