import React from 'react';
import { GoSettings } from 'react-icons/go';
import { MdOutlineClose } from 'react-icons/md';

import { MenuButton, MenuGroup } from '@elements/MenuButton';

import { CameraGroundWidget } from './WidgetCameraGround';
import { ShadingWidget } from './WidgetShading';
import { ShowGridWidget } from './WidgetShowGrid';

export function Settings() {
    const [open, setOpen] = React.useState(false);

    if (!open)
        return (
            <div className="absolute bottom-4 right-4">
                <MenuGroup>
                    <MenuButton onClick={() => setOpen(true)} tipTitle="Viewer Settings">
                        <GoSettings className="text-2xl" />
                    </MenuButton>
                </MenuGroup>
            </div>
        );

    return (
        <div className="absolute bottom-4 right-4 bg-white p-2 border rounded-md w-80">
            <div className="flex flex-row justify-end absolute right-2 bottom-2">
                <button
                    className="px-2 py-2 rounded-md hover:bg-neutral-200"
                    onClick={() => setOpen(false)}
                    title="Close Viewer Settings"
                >
                    <MdOutlineClose />
                </button>
            </div>
            <div className="space-y-2 ">
                <ShadingWidget />
                <CameraGroundWidget />
                <ShowGridWidget />
            </div>
        </div>
    );
}
