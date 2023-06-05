import { vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { changeSelection } from './selection';

export interface ViewContextProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    selectedModel: EditorModel | null;
    selectedSubmodels: number[];

    select: (
        model: EditorModel | null,
        submodelIDs?: number[],
        toggle?: boolean,
        extend?: boolean
    ) => void;

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
}

export const ViewContext = React.createContext<ViewContextProps>({} as ViewContextProps);

export function ViewContextComponent(props: { children: React.ReactNode }) {
    const [renderer] = React.useState(new GL.Renderer());
    const [scene] = React.useState(new GL.Scene());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selectedModel, setSelectedModel] = React.useState<EditorModel | null>(null);
    const [selectedSubmodels, setSelectedSubmodels] = React.useState<number[]>([]);
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(true);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);

    React.useEffect(() => {
        const onChange = () => {
            const copy = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
            setModels(copy);
            if (selectedModel !== null && !copy.includes(selectedModel)) setSelectedModel(null);
        };

        scene.addChangeListener(onChange);

        return () => {
            scene.removeChangeListener(onChange);
        };
    }, [scene, selectedModel]);

    //selection callback, still a bit hacky but nicer than before
    function select(
        model: EditorModel | null,
        submodelIDs: number[] = [],
        toggle: boolean = false,
        extend: boolean = false
    ) {
        submodelIDs = changeSelection(
            selectedModel,
            model,
            selectedSubmodels,
            submodelIDs,
            toggle,
            extend
        );

        setSelectedModel(model);
        setSelectedSubmodels(submodelIDs);
    }

    return (
        <ViewContext.Provider
            value={{
                scene,
                renderer,
                activeView: 0,
                models,
                selectedModel,
                selectedSubmodels,
                select,
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
            }}
        >
            {props.children}
        </ViewContext.Provider>
    );
}
