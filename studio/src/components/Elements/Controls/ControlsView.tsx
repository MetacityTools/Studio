import React from 'react';
import { GoSettings } from 'react-icons/go';
import { MdOutlineClose } from 'react-icons/md';

import { MenuButton, MenuGroup } from '@elements/Button';

import { CameraGroundWidget } from '../../Editor/Canvas/WidgetCameraGround';
import { ShadingWidget } from '../../Editor/Canvas/WidgetShading';
import { ShowGridWidget } from '../../Editor/Canvas/WidgetShowGrid';

export function ControlsView() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <div>
                {open && (
                    <div className="absolute top-12 left-0 p-2 border rounded-md w-80 m-none bg-white">
                        <div className="space-y-2">
                            <ShadingWidget />
                            <CameraGroundWidget />
                            <ShowGridWidget />
                        </div>
                    </div>
                )}
                <MenuGroup>
                    <MenuButton
                        onClick={() => setOpen(!open)}
                        tipTitle="Viewer Settings"
                        active={open}
                    >
                        <GoSettings className="text-2xl" />
                    </MenuButton>
                </MenuGroup>
            </div>
        </>
    );
}
