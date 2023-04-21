import React from 'react';
import { BiRectangle } from 'react-icons/bi';
import { TbPerspective, TbVectorTriangle } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';
import { GeometryMode } from '@utils/models/geometry';

import * as GL from '@bananagl/bananagl';

import { CubeEmpty, CubeLeft, CubeRight, CubeTop, TriangleFull } from '@elements/Icons';
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
    const [geometryMode, setGeometryMode] = React.useState<GeometryMode>(GeometryMode.SOLID);
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [zmin, setZmin] = React.useState<number>(0);
    const [zmax, setZmax] = React.useState<number>(50);

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

    const setView = (viewMode: GL.CameraView) => {
        const view = renderer.views[props.view].view;
        view.cameraLock.mode = viewMode;
        setMode(viewMode);
    };

    const updateCamTargetZ = (value: number) => {
        if (isNaN(value)) return;

        const view = renderer.views[props.view].view;
        view.camera.z = value;
        setCamTargetZ(value);
    };

    const updateZmin = (value: number) => {
        if (isNaN(value)) return;

        scene.objects.forEach((obj) => {
            obj.uniforms.uZMin = value;
        });
        setZmin(value);
    };

    const updateZmax = (value: number) => {
        if (isNaN(value)) return;

        scene.objects.forEach((obj) => {
            obj.uniforms.uZMax = value;
        });
        setZmax(value);
    };

    const setWireframe = () => {
        setGeometryMode(GeometryMode.WIREFRAME);

        scene.objects.forEach((obj) => {
            if (obj instanceof EditorModel) {
                obj.geometryMode = GeometryMode.WIREFRAME;
                obj.attributes.needsRebind = true;
                console.log(obj);
            }
        });

        scene.shadersChanged = true;
    };

    const setSolid = () => {
        setGeometryMode(GeometryMode.SOLID);

        scene.objects.forEach((obj) => {
            if (obj instanceof EditorModel) {
                obj.geometryMode = GeometryMode.SOLID;
                obj.attributes.needsRebind = true;
            }
        });

        scene.shadersChanged = true;
    };

    return (
        <>
            <div className="absolute m-4 space-x-2 left-0 top-0 z-40 flex flex-row ">
                <MenuGroup>
                    <MenuButton
                        onClick={setOrtho}
                        tipTitle="Orthographic Camera"
                        tipPosition="top"
                        active={projection === GL.ProjectionType.ORTHOGRAPHIC}
                    >
                        <BiRectangle className="text-2xl" />
                    </MenuButton>
                    <MenuButton
                        onClick={setPerspective}
                        tipTitle="Perspective Camera"
                        tipPosition="top"
                        active={projection === GL.ProjectionType.PERSPECTIVE}
                    >
                        <TbPerspective className="text-2xl" />
                    </MenuButton>
                </MenuGroup>
                <MenuGroup>
                    <MenuButton
                        tipTitle="Free View"
                        tipPosition="top"
                        onClick={setView.bind(null, GL.CameraView.Free)}
                        active={mode === GL.CameraView.Free}
                    >
                        <CubeEmpty className="text-2xl" />
                    </MenuButton>
                    <MenuButton
                        tipTitle="Top View"
                        tipPosition="top"
                        onClick={setView.bind(null, GL.CameraView.Top)}
                        active={mode === GL.CameraView.Top}
                    >
                        <CubeTop className="text-2xl" />
                    </MenuButton>
                    <MenuButton
                        tipTitle="Front View"
                        tipPosition="top"
                        onClick={setView.bind(null, GL.CameraView.Front)}
                        active={mode === GL.CameraView.Front}
                    >
                        <CubeLeft className="text-2xl" />
                    </MenuButton>
                    <MenuButton
                        tipTitle="Right View"
                        tipPosition="top"
                        onClick={setView.bind(null, GL.CameraView.Right)}
                        active={mode === GL.CameraView.Right}
                    >
                        <CubeRight className="text-2xl" />
                    </MenuButton>
                    <MenuButton
                        tipTitle="Left View"
                        tipPosition="top"
                        onClick={setView.bind(null, GL.CameraView.Left)}
                        active={mode === GL.CameraView.Left}
                    >
                        <CubeLeft className="text-2xl scale-y-[-100%]" />
                    </MenuButton>
                    <MenuButton
                        tipTitle="Back View"
                        tipPosition="top"
                        onClick={setView.bind(null, GL.CameraView.Back)}
                        active={mode === GL.CameraView.Back}
                    >
                        <CubeRight className="text-2xl scale-y-[-100%]" />
                    </MenuButton>
                </MenuGroup>
                <MenuGroup>
                    <MenuButton
                        onClick={setSolid}
                        tipTitle="Solid Mode"
                        tipPosition="top"
                        active={geometryMode === GeometryMode.SOLID}
                    >
                        <TriangleFull className="text-2xl" />
                    </MenuButton>
                    <MenuButton
                        onClick={setWireframe}
                        tipTitle="Wireframe Mode"
                        tipPosition="top"
                        active={geometryMode === GeometryMode.WIREFRAME}
                    >
                        <TbVectorTriangle className="text-2xl" />
                    </MenuButton>
                </MenuGroup>
            </div>
            <div className="absolute m-4 space-x-2 right-0 top-0 z-40 flex flex-row">
                <MenuGroup column>
                    <MenuInput
                        label="Ground Level"
                        value={camTargetZ}
                        onChange={updateCamTargetZ}
                    />
                </MenuGroup>
            </div>
        </>
    );
}
