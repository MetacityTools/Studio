import clsx from 'clsx';
import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    full?: boolean;
}

export function Container(props: ContainerProps) {
    const { children, className, full, ...rest } = props;
    return (
        <div className={clsx(full ? 'w-screen' : 'max-w-[100rem] mx-auto', className)} {...rest}>
            {children}
        </div>
    );
}
