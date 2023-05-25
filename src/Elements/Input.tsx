import clsx from 'clsx';
import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const className = props.className || '';
    return (
        <input
            {...props}
            className={clsx(className, 'focus:bg-amber-100 outline-none')}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        />
    );
}
