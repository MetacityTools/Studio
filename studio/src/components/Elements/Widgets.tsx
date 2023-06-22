import clsx from 'clsx';
import React from 'react';

import { colorBase, colorBaseNoHover } from './colors';

export function Widget(props: { children?: React.ReactNode; onClick?: () => void }) {
    return (
        <div
            className={clsx(
                'flex flex-col rounded-md border',
                props.onClick ? colorBase : colorBaseNoHover,
                props.onClick && 'cursor-pointer'
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
