import clsx from 'clsx';
import React from 'react';
import { TbHelp, TbHelpOff } from 'react-icons/tb';

import { MouseLeft, MouseRight, MouseWheel } from '@elements/Icons';

import { useGrayscale } from '@shared/Context/hooks';

export function Help() {
    const [show, setShow] = React.useState(false);
    const [grayscale] = useGrayscale();

    function HelpItem(props: { label: string; action: string; last?: boolean }) {
        return (
            <div className={clsx('flex flex-col  pr-2', !props.last && 'border-inherit border-r')}>
                <div className="text-xs opacity-75">{props.label}</div>
                <div className="text-xs">{props.action}</div>
            </div>
        );
    }

    return (
        <div
            className={clsx(
                'absolute bottom-4 left-4 text-md py-2 px-4 rounded-md flex flex-row space-x-4 text-xl cursor-pointer border',
                'base',
                grayscale && 'filter grayscale'
            )}
            onClick={() => setShow(!show)}
        >
            {!show && (
                <div className="flex space-x-2 items-center">
                    <TbHelp />
                    <HelpItem last label="Controls" action="Help" />
                </div>
            )}
            {show && (
                <div className="flex space-x-2 items-center border-inherit">
                    <MouseLeft />
                    <HelpItem label="Drag" action="Pan" />
                    <MouseLeft />
                    <HelpItem label="Click" action="Select" />
                    <MouseLeft />
                    <HelpItem label="Shift + Drag" action="Range Select" />
                    <MouseLeft />
                    <HelpItem label="Ctrl + Drag" action="Rotate" />
                    <MouseRight />
                    <HelpItem label="Drag" action="Rotate" />
                    <MouseWheel />
                    <HelpItem last label="Wheel" action="Zoom" />
                </div>
            )}
        </div>
    );
}
