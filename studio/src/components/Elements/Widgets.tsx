import clsx from 'clsx';
import React from 'react';

export function Widget(props: { children?: React.ReactNode; onClick?: () => void }) {
    return (
        <div
            className={clsx(
                'flex flex-col rounded-md border',
                props.onClick ? 'base cursor-pointer' : 'base-no-hover'
            )}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}

export function WidgetLine(props: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex flex-row items-center w-full text-base group', props.className)}>
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

export function WidgetPrompt(props: { children?: React.ReactNode }) {
    return <div className="py-2 px-4 w-full">{props.children}</div>;
}

export function WidgetButton(props: { children?: React.ReactNode; onClick?: () => void }) {
    return (
        <div
            className={clsx(
                'py-2 px-4 w-full flex flex-row items-center group-last:rounded-b-md',
                'hover:bg-amber-200 hover:text-amber-600 dark:hover:bg-amber-700 dark:hover:text-amber-400 cursor-pointer'
            )}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}
