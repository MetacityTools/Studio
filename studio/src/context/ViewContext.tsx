import { vec3 } from 'gl-matrix';
import React from 'react';

import * as GL from '@bananagl/bananagl';

import { EditorModel } from '@data/EditorModel';
import { MetadataNode, StyleNode } from '@data/types';

export type SelectFunction = (selection: SelectionType, toggle?: boolean, extend?: boolean) => void;
export type SelectionType = Map<EditorModel, Set<number>>;
export type Tooltip = { data: any; x: number; y: number } | null;

interface ViewContextProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    setModels: React.Dispatch<React.SetStateAction<EditorModel[]>>;
    selection: SelectionType;
    setSelection: React.Dispatch<React.SetStateAction<SelectionType>>;
    tooltip: Tooltip | null;
    setTooltip: React.Dispatch<React.SetStateAction<Tooltip | null>>;
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
    styles: StyleNode;
    setStyles: React.Dispatch<React.SetStateAction<StyleNode>>;
    usedStyle: string[] | null;
    setUsedStyle: React.Dispatch<React.SetStateAction<string[] | null>>;
    lastUsedStyle: string[] | null;
    setLastUsedStyle: React.Dispatch<React.SetStateAction<string[] | null>>;
    greyscale: boolean;
    setGreyscale: React.Dispatch<React.SetStateAction<boolean>>;
    darkmode: boolean;
    setDarkmode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const context = React.createContext<ViewContextProps>({} as ViewContextProps);

export function ViewContext(props: { children: React.ReactNode }) {
    const [renderer] = React.useState(new GL.Renderer());
    const [scene] = React.useState(new GL.Scene());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selection, setSelection] = React.useState<SelectionType>(new Map());
    const [tooltip, setTooltip] = React.useState<Tooltip | null>(null);
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(false);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);
    const [metadata, setMetadata] = React.useState<MetadataNode>({});
    const [styles, setStyles] = React.useState<StyleNode>({});
    const [lastUsedStyle, setLastUsedStyle] = React.useState<string[] | null>(null);
    const [usedStyle, setUsedStyle] = React.useState<string[] | null>(null);
    const [greyscale, setGreyscale] = React.useState<boolean>(false);

    const sd = localStorage.getItem('darkmode');
    const [darkmode, setDarkmode] = React.useState<boolean>(sd === 'true' ? true : false);

    const activeView = 0;

    React.useEffect(() => {
        let minZ = Infinity;
        let maxZ = -Infinity;

        for (const model of models) {
            const bbox = model.boundingBox;
            minZ = Math.min(minZ, bbox.min[2]);
            maxZ = Math.max(maxZ, bbox.max[2]);
        }
        setMinShade(minZ);
        setMaxShade(maxZ);
        if (isFinite(minZ)) setCamTargetZ(minZ);
    }, [models]);

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

    React.useEffect(() => {
        if (darkmode) {
            renderer.clearColor = [0.1, 0.1, 0.1, 1];
            document.documentElement.style.setProperty('color-scheme', 'dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkmode', 'true');
        } else {
            renderer.clearColor = [1, 1, 1, 1];
            document.documentElement.style.setProperty('color-scheme', 'light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkmode', 'false');
        }
    }, [darkmode, renderer]);

    return (
        <context.Provider
            value={{
                scene,
                renderer,
                activeView: activeView,
                models,
                setModels,
                selection,
                setSelection,
                tooltip,
                setTooltip,
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
                styles,
                setStyles,
                usedStyle,
                setUsedStyle,
                lastUsedStyle,
                setLastUsedStyle,
                greyscale: greyscale,
                setGreyscale: setGreyscale,
                darkmode,
                setDarkmode,
            }}
        >
            {props.children}
        </context.Provider>
    );
}
