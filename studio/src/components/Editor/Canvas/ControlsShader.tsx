import React from 'react';
import { TbVectorTriangle } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';
import { GeometryMode } from '@utils/types';

import { EditorContext } from '@editor/Context/EditorContext';

import { TriangleFull } from '@elements/Icons';
import { MenuButton, MenuGroup } from '@elements/MenuButton';

export function ShaderControls() {
    const { scene } = React.useContext(EditorContext);

    const [geometryMode, setGeometryMode] = React.useState<GeometryMode>(GeometryMode.SOLID);

    const setWireframe = () => {
        setGeometryMode(GeometryMode.WIREFRAME);

        scene.objects.forEach((obj) => {
            if (obj instanceof EditorModel) {
                obj.geometryMode = GeometryMode.WIREFRAME;
                obj.attributes.needsRebind = true;
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
        <MenuGroup>
            <MenuButton
                onClick={setSolid}
                tipTitle="Solid Mode"
                active={geometryMode === GeometryMode.SOLID}
            >
                <TriangleFull className="text-2xl" />
            </MenuButton>
            <MenuButton
                onClick={setWireframe}
                tipTitle="Wireframe Mode"
                active={geometryMode === GeometryMode.WIREFRAME}
            >
                <TbVectorTriangle className="text-2xl" />
            </MenuButton>
        </MenuGroup>
    );
}
