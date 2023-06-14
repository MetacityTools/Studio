import clsx from 'clsx';
import React from 'react';
import { TbHelp, TbHelpOff } from 'react-icons/tb';

import { MouseLeft, MouseRight, MouseWheel } from '@elements/Icons';

function HelpItem(props: { children: React.ReactNode; last?: boolean }) {
    return (
        <div className={clsx('flex flex-col  pr-2', !props.last && ' border-r')}>
            {props.children}
        </div>
    );
}

export function Help() {
    const [show, setShow] = React.useState(false);

    if (!show)
        return (
            <div
                className="absolute bottom-4 left-4 bg-white text-md py-2 px-4 rounded-md flex flex-row space-x-4 text-xl cursor-pointer border hover:shadow-even transition-all hover:bg-neutral-100"
                onClick={() => setShow(true)}
            >
                <div className="flex space-x-2 items-center">
                    <TbHelp />
                    <HelpItem last>
                        <div className="text-xs text-neutral-500">Controls</div>
                        <div className="text-xs">Help</div>
                    </HelpItem>
                </div>
            </div>
        );

    return (
        <div
            className="absolute bottom-4 left-4 bg-white text-md py-2 px-4 rounded-md flex flex-row space-x-4 text-xl border cursor-pointer hover:shadow-even transition-shadow"
            onClick={() => setShow(false)}
        >
            <div className="flex space-x-2 items-center">
                <MouseLeft />
                <HelpItem>
                    <div className="text-xs text-neutral-500">Drag</div>
                    <div className="text-xs">Pan</div>
                </HelpItem>
                <MouseLeft />
                <HelpItem>
                    <div className="text-xs text-neutral-500">Click</div>
                    <div className="text-xs">Select</div>
                </HelpItem>
                <MouseLeft />
                <HelpItem>
                    <div className="text-xs text-neutral-500">Shift + Drag</div>
                    <div className="text-xs">Range Select</div>
                </HelpItem>
                <MouseLeft />
                <HelpItem>
                    <div className="text-xs text-neutral-500">Ctrl + Drag</div>
                    <div className="text-xs">Rotate</div>
                </HelpItem>
                <MouseRight />
                <HelpItem>
                    <div className="text-xs text-neutral-500">Drag</div>
                    <div className="text-xs">Rotate</div>
                </HelpItem>
                <MouseWheel />
                <HelpItem last>
                    <div className="text-xs text-neutral-500">Wheel</div>
                    <div className="text-xs">Zoom</div>
                </HelpItem>
            </div>
        </div>
    );
}
