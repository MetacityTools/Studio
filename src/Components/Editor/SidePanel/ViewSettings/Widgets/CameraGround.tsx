import React from 'react';
import { TbCircuitGround } from 'react-icons/tb';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@components/Editor/Utils/Context';

import { Range } from '@elements/Range';
import { DetailWidget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function CameraGroundWidget() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { renderer, activeView, camTargetZ, setCamTargetZ } = ctx;

    const [upShortcut, setUpShortcut] = React.useState<GL.ShortcutOnPress>(
        new GL.ShortcutOnPress('ArrowUp', () => {})
    );
    const [downShortcut, setDownShortcut] = React.useState<GL.ShortcutOnPress>(
        new GL.ShortcutOnPress('ArrowDown', () => {})
    );

    const updateCamTargetZ = (value: number) => {
        if (isNaN(value)) return;

        const view = renderer.views[activeView].view;
        view.camera.z = value;
        setCamTargetZ(value);
    };

    React.useEffect(() => {
        renderer.onInit = () => {
            const controls = renderer.window.controls;
            controls.addShortcut(upShortcut);
            controls.addShortcut(downShortcut);
        };
    }, []);

    React.useEffect(() => {
        upShortcut.onTrigger = (view) => {
            updateCamTargetZ(camTargetZ + 1);
        };

        downShortcut.onTrigger = (view) => {
            updateCamTargetZ(camTargetZ - 1);
        };
    }, [camTargetZ]);

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <TbCircuitGround className="mr-2" />
                    Camera Ground Level
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Set Ground Level for the camera</WidgetDescription>
            </WidgetLine>
            <WidgetLine className="py-2 px-4">Camera ground is at {camTargetZ}</WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Range min={-1000} max={1000} value={camTargetZ} onChange={updateCamTargetZ} />
            </WidgetLine>
        </DetailWidget>
    );
}
