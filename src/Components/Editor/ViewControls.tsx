import React from 'react';
import { BiRectangle } from 'react-icons/bi';
import { TbPerspective, TbVectorTriangle } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';
import { GeometryMode } from '@utils/models/geometry';

import * as GL from '@bananagl/bananagl';

import { CubeEmpty, CubeLeft, CubeRight, CubeTop, TriangleFull } from '@elements/Icons';
import { MenuButton, MenuGroup, MenuInput } from '@elements/MenuButton';

import { CameraZControls } from './ViewControls/CameraZ';
import { DirectionControls } from './ViewControls/Direction';
import { ProjectionControls } from './ViewControls/Projection';
import { ShaderControls } from './ViewControls/Shader';

export interface EditorMenuProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    view: number;
}

export function ViewControls(props: EditorMenuProps) {
    const { scene, renderer } = props;

    return (
        <>
            <div className="absolute m-4 space-x-2 left-0 top-0 z-40 flex flex-row ">
                <ProjectionControls {...props} />
                <DirectionControls {...props} />
                <ShaderControls {...props} />
            </div>
            <div className="absolute m-4 space-x-2 right-0 top-0 z-40 flex flex-row">
                <CameraZControls {...props} />
            </div>
        </>
    );
}
