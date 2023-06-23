import React from 'react';
import { TbVectorTriangle } from 'react-icons/tb';

import { EditorModel, GeometryMode } from '@utils/utils';

import { MenuButton, MenuGroup } from '@elements/Button';
import { TriangleFull, TriangleFullFilled } from '@elements/Icons';

import { useScene } from '@shared/Context/hooks';

export function ShaderControls() {
    const [geometryMode, setGeometryMode] = React.useState<GeometryMode>(GeometryMode.SOLID);
    const scene = useScene();

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

    const setNoEdges = () => {
        setGeometryMode(GeometryMode.NOEDGES);

        scene.objects.forEach((obj) => {
            if (obj instanceof EditorModel) {
                obj.geometryMode = GeometryMode.NOEDGES;
                obj.attributes.needsRebind = true;
            }
        });

        scene.shadersChanged = true;
    };

    return (
        <MenuGroup>
            <MenuButton
                onClick={setNoEdges}
                tipTitle="Smooth Mode"
                active={geometryMode === GeometryMode.NOEDGES}
            >
                <TriangleFullFilled className="text-2xl" />
            </MenuButton>
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
