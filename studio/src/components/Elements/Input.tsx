import clsx from 'clsx';
import React from 'react';

//use with onChange to update state
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const className = props.className || '';
    return (
        <input
            {...props}
            className={clsx(className, 'outline-none')}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        />
    );
}
