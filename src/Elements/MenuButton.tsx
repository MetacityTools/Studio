import React from 'react';

export function MenuButton(props: { children: React.ReactNode }) {
    return (
        <div className="text-xs rounded-2xl bg-neutral-900/75 hover:bg-neutral-700 cursor-pointer">
            {props.children}
        </div>
    );
}
