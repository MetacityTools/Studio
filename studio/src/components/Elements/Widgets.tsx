import clsx from 'clsx';
import React from 'react';

export function DetailWidget(props: { children?: React.ReactNode; onClick?: () => void }) {
    return (
        <div
            className={clsx(
                'flex flex-col bg-neutral-100 rounded-md text-neutral-500',
                props.onClick &&
                    'cursor-pointer hover:bg-amber-300 hover:text-amber-900 transition-colors'
            )}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}

export function WidgetLine(props: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex flex-row items-center w-full text-base', props.className)}>
            {props.children}
        </div>
    );
}

export function WidgetTitle(props: { children?: React.ReactNode }) {
    return <div className="py-2 px-4 w-full flex flex-row items-center">{props.children}</div>;
}

export function WidgetDescription(props: { children?: React.ReactNode }) {
    return <div className="py-2 px-4 w-full text-xs">{props.children}</div>;
}
