import { vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel, MetadataNode } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { extractMetadata } from './metadata';
import { SelectionType } from './selection';

export type SelectFunction = (selection: SelectionType, toggle?: boolean, extend?: boolean) => void;

interface ViewContextProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    selection: SelectionType;
    setSelection: React.Dispatch<React.SetStateAction<SelectionType>>;
    camTargetZ: number;
    setCamTargetZ: React.Dispatch<React.SetStateAction<number>>;
    minShade: number;
    setMinShade: React.Dispatch<React.SetStateAction<number>>;
    maxShade: number;
    setMaxShade: React.Dispatch<React.SetStateAction<number>>;
    gridVisible: boolean;
    setGridVisible: React.Dispatch<React.SetStateAction<boolean>>;
    globalShift: vec3 | null;
    setGlobalShift: React.Dispatch<React.SetStateAction<vec3 | null>>;
    metadata: MetadataNode;
    setMetadata: React.Dispatch<React.SetStateAction<MetadataNode>>;
}

export const context = React.createContext<ViewContextProps>({} as ViewContextProps);

export function ViewContext(props: { children: React.ReactNode }) {
    const [renderer] = React.useState(new GL.Renderer());
    const [scene] = React.useState(new GL.Scene());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selection, setSelection] = React.useState<SelectionType>(new Map());
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(false);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);
    const [metadata, setMetadata] = React.useState<MetadataNode>({});
    const activeView = 0;

    React.useEffect(() => {
        const onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];

            let minZ = Infinity;
            let maxZ = -Infinity;

            for (const model of copy) {
                const bbox = model.boundingBox;
                minZ = Math.min(minZ, bbox.min[2]);
                maxZ = Math.max(maxZ, bbox.max[2]);
            }

            setModels(copy);
            setMinShade(minZ);
            setMaxShade(maxZ);
            if (isFinite(minZ)) setCamTargetZ(minZ);

            const data = extractMetadata(copy);
            setMetadata(data);
            console.log(data);
        };

        scene.addChangeListener(onChange);

        return () => {
            scene.removeChangeListener(onChange);
        };
    }, [scene]);

    React.useEffect(() => {
        const onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];

            let selectionCopy = new Map(selection);
            let changed = false;
            for (const model of copy) {
                if (selectionCopy.has(model)) continue;
                selectionCopy.delete(model);
                changed = true;
            }

            if (changed) setSelection(selectionCopy);
        };

        scene.addChangeListener(onChange);

        return () => {
            scene.removeChangeListener(onChange);
        };
    }, [scene, selection]);

    React.useEffect(() => {
        models.forEach((object) => {
            if (object instanceof EditorModel) {
                object.uniforms = {
                    uZMin: minShade,
                };
            }
        });
    }, [minShade, models]);

    React.useEffect(() => {
        models.forEach((object) => {
            if (object instanceof EditorModel) {
                object.uniforms = {
                    uZMax: maxShade,
                };
            }
        });
    }, [maxShade, models]);

    React.useEffect(() => {
        const view = renderer.views[activeView].view;
        view.camera.z = camTargetZ;
    }, [activeView, renderer, camTargetZ]);

    return (
        <context.Provider
            value={{
                scene,
                renderer,
                activeView: activeView,
                models,
                selection,
                setSelection,
                camTargetZ,
                setCamTargetZ,
                minShade,
                setMinShade,
                maxShade,
                setMaxShade,
                gridVisible,
                setGridVisible,
                globalShift,
                setGlobalShift,
                metadata,
                setMetadata,
            }}
        >
            {props.children}
        </context.Provider>
    );
}
