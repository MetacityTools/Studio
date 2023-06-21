import React from 'react';

import { useActiveView, useRenderer } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { MenuButton, MenuGroup } from '@elements/Button';
import { CubeEmpty, CubeLeft, CubeRight, CubeTop } from '@elements/Icons';

export function DirectionControls() {
    const [mode, setMode] = React.useState<GL.CameraView>(GL.CameraView.Free);
    const renderer = useRenderer();
    const activeView = useActiveView();

    const setView = (viewMode: GL.CameraView) => {
        const view = renderer.views[activeView].view;
        view.cameraLock.mode = viewMode;
        setMode(viewMode);
    };

    React.useEffect(() => {
        renderer.onInit = () => {
            const controls = renderer.window.controls;
            controls.addShortcut(
                new GL.ShortcutOnPress('Digit7', (view: GL.View) => {
                    setView(GL.CameraView.Top);
                })
            );

            controls.addShortcut(
                new GL.ShortcutOnPress('Digit1', (view: GL.View) => {
                    setView(GL.CameraView.Front);
                })
            );

            controls.addShortcut(
                new GL.ShortcutOnPress('Digit3', (view: GL.View) => {
                    setView(GL.CameraView.Right);
                })
            );

            controls.addShortcut(
                new GL.ShortcutOnPress('Digit5', (view: GL.View) => {
                    setView(GL.CameraView.Free);
                })
            );
        };
    }, []);

    return (
        <MenuGroup>
            <MenuButton
                tipTitle="Free View"
                onClick={setView.bind(null, GL.CameraView.Free)}
                active={mode === GL.CameraView.Free}
            >
                <CubeEmpty className="text-2xl" />
            </MenuButton>
            <MenuButton
                tipTitle="Top View"
                onClick={setView.bind(null, GL.CameraView.Top)}
                active={mode === GL.CameraView.Top}
            >
                <CubeTop className="text-2xl" />
            </MenuButton>
            <MenuButton
                tipTitle="Front View"
                onClick={setView.bind(null, GL.CameraView.Front)}
                active={mode === GL.CameraView.Front}
            >
                <CubeLeft className="text-2xl" />
            </MenuButton>
            <MenuButton
                tipTitle="Right View"
                onClick={setView.bind(null, GL.CameraView.Right)}
                active={mode === GL.CameraView.Right}
            >
                <CubeRight className="text-2xl" />
            </MenuButton>
            <MenuButton
                tipTitle="Left View"
                onClick={setView.bind(null, GL.CameraView.Left)}
                active={mode === GL.CameraView.Left}
            >
                <CubeLeft className="text-2xl scale-y-[-100%]" />
            </MenuButton>
            <MenuButton
                tipTitle="Back View"
                onClick={setView.bind(null, GL.CameraView.Back)}
                active={mode === GL.CameraView.Back}
            >
                <CubeRight className="text-2xl scale-y-[-100%]" />
            </MenuButton>
        </MenuGroup>
    );
}
