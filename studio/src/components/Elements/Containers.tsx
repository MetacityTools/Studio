import clsx from 'clsx';
import React from 'react';

export function OverflowContainer(props: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('w-full h-full overflow-auto', props.className)}>{props.children}</div>
    );
}

export function OverflowAbsoluteContainer(props: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <OverflowContainer className={clsx('absolute', props.className)}>
            {props.children}
        </OverflowContainer>
    );
}

export function ColumnContainer(props: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex flex-col h-full w-full', props.className)}>{props.children}</div>
    );
}

export function RowContainer(props: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex flex-row items-center', props.className)}>{props.children}</div>
    );
}

export function StretchContainer(props: { children: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex-1 w-full h-full relative', props.className)}>
            {props.children}
        </div>
    );
}
