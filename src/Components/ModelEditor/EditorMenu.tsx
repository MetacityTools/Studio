import React from 'react';
import { BiRectangle } from 'react-icons/bi';
import { TbPerspective } from 'react-icons/tb';

import * as GL from '@bananagl/bananagl';

import { CubeEmpty, CubeLeft, CubeRight, CubeTop } from '@elements/Icons';
import { MenuButton, MenuGroup, MenuInput } from '@elements/MenuButton';

interface EditorMenuProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    view: number;
}

export function EditorMenu(props: EditorMenuProps) {
    const { scene, renderer } = props;
    const [projection, setProjection] = React.useState<GL.ProjectionType>(
        GL.ProjectionType.ORTHOGRAPHIC
    );
    const [mode, setMode] = React.useState<GL.CameraView>(GL.CameraView.Free);
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);

    const setPerspective = () => {
        const view = renderer.views[props.view].view;
        view.camera.projectionType = GL.ProjectionType.PERSPECTIVE;
        setProjection(GL.ProjectionType.PERSPECTIVE);
    };

    const setOrtho = () => {
        const view = renderer.views[props.view].view;
        view.camera.projectionType = GL.ProjectionType.ORTHOGRAPHIC;
        setProjection(GL.ProjectionType.ORTHOGRAPHIC);
    };

    const setTop = () => {
        const view = renderer.views[props.view].view;
        view.cameraLock.mode = GL.CameraView.Top;
        setMode(GL.CameraView.Top);
    };

    const setFront = () => {
        const view = renderer.views[props.view].view;
        view.cameraLock.mode = GL.CameraView.Front;
        setMode(GL.CameraView.Front);
    };

    const setSide = () => {
        const view = renderer.views[props.view].view;
        view.cameraLock.mode = GL.CameraView.Side;
        setMode(GL.CameraView.Side);
    };

    const setFree = () => {
        const view = renderer.views[props.view].view;
        view.cameraLock.mode = GL.CameraView.Free;
        setMode(GL.CameraView.Free);
    };

    const updateCamTargetZ = (value: number) => {
        if (isNaN(value)) return;

        const view = renderer.views[props.view].view;
        view.camera.z = value;
        setCamTargetZ(value);
    };

    return (
        <div className="absolute m-4 space-y-2 right-0 bottom-0 z-100">
            <div className="flex flex-row justify-end">
                <div className="space-y-2">
                    <MenuGroup>
                        <MenuButton
                            onClick={setOrtho}
                            tipTitle="Orthographic Camera"
                            tipPosition="right"
                            active={projection === GL.ProjectionType.ORTHOGRAPHIC}
                        >
                            <BiRectangle className="text-2xl" />
                        </MenuButton>
                        <MenuButton
                            onClick={setPerspective}
                            tipTitle="Perspective Camera"
                            tipPosition="right"
                            active={projection === GL.ProjectionType.PERSPECTIVE}
                        >
                            <TbPerspective className="text-2xl" />
                        </MenuButton>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuButton
                            tipTitle="Free View"
                            tipPosition="right"
                            onClick={setFree}
                            active={mode === GL.CameraView.Free}
                        >
                            <CubeEmpty className="text-2xl" />
                        </MenuButton>
                        <MenuButton
                            tipTitle="Top View"
                            tipPosition="right"
                            onClick={setTop}
                            active={mode === GL.CameraView.Top}
                        >
                            <CubeTop className="text-2xl" />
                        </MenuButton>
                        <MenuButton
                            tipTitle="Front View"
                            tipPosition="right"
                            onClick={setFront}
                            active={mode === GL.CameraView.Front}
                        >
                            <CubeLeft className="text-2xl" />
                        </MenuButton>
                        <MenuButton
                            tipTitle="Side View"
                            tipPosition="right"
                            onClick={setSide}
                            active={mode === GL.CameraView.Side}
                        >
                            <CubeRight className="text-2xl" />
                        </MenuButton>
                    </MenuGroup>
                </div>
            </div>
            <MenuGroup>
                <MenuInput label="Ground Level" value={0} onChange={updateCamTargetZ} />
            </MenuGroup>
        </div>
    );
}
