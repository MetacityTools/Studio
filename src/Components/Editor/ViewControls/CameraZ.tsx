import React from 'react';

import * as GL from '@bananagl/bananagl';

import { MenuGroup, MenuInput } from '@elements/MenuButton';

import { EditorMenuProps } from '../ViewControls';

export function CameraZControls(props: EditorMenuProps) {
    const { renderer } = props;
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);

    const [upShortcut, setUpShortcut] = React.useState<GL.ShortcutOnPress>(
        new GL.ShortcutOnPress('ArrowUp', () => {})
    );
    const [downShortcut, setDownShortcut] = React.useState<GL.ShortcutOnPress>(
        new GL.ShortcutOnPress('ArrowDown', () => {})
    );

    const updateCamTargetZ = (value: number) => {
        if (isNaN(value)) return;

        const view = renderer.views[props.view].view;
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
        <MenuGroup column>
            <MenuInput label="Camera Ground Level" value={camTargetZ} onChange={updateCamTargetZ} />
        </MenuGroup>
    );
}
