import clsx from 'clsx';
import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function Container(props: ContainerProps) {
    const { children, className, ...rest } = props;
    return (
        <div className={clsx('max-w-[100rem] mx-auto pb-8', className)} {...rest}>
            {children}
        </div>
    );
}
