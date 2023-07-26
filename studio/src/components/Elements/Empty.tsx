import React from 'react';

export function Empty(props: { children?: React.ReactNode }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-4xl text-neutral-300 dark:text-neutral-700 text-center">
                {props.children}
            </div>
        </div>
    );
}
