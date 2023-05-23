import { vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel } from '@utils/models/models/EditorModel';
import { changeSelection } from '@utils/seleciton/selection';

import * as GL from '@bananagl/bananagl';

export type SelectAction = (
    model: EditorModel | null,
    submodelIDs: number[],
    toggle: boolean,
    extend: boolean
) => void;

export class SelectionManager {
    private onUpdate: SelectAction | null = null;
    constructor() {}

    addChangeListener(onUpdate: SelectAction) {
        this.onUpdate = onUpdate;
    }

    updateSelection(
        model: EditorModel | null,
        submodelIDs: number[],
        toggle: boolean,
        extend: boolean
    ) {
        if (this.onUpdate === null) return;
        this.onUpdate(model, submodelIDs, toggle, extend);
    }
}

interface EditorContextProps {
    processing: boolean;
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    setModels: React.Dispatch<React.SetStateAction<EditorModel[]>>;
    selectedModel: EditorModel | null;
    setSelectedModel: (model: EditorModel | null) => void;
    loadingStatus: string;
    setLoadingStatus: React.Dispatch<React.SetStateAction<string>>;
    selectedSubmodels: number[];
    setSelectedSubmodels: React.Dispatch<React.SetStateAction<number[]>>;
    selection: SelectionManager;
}

export const EditorContext = React.createContext<EditorContextProps>({} as EditorContextProps);

export function ContextComponent(props: { children: React.ReactNode }) {
    const [renderer] = React.useState(new GL.Renderer());
    const [scene] = React.useState(new GL.Scene());
    const [models, setModels] = React.useState<EditorModel[]>([]);

    //this is really not neat but it works (needed to make out-of-react updates)
    const [selectionManager] = React.useState(new SelectionManager());
    const [selectedModel, setSelectedModel] = React.useState<EditorModel | null>(null);
    const [selectedSubmodels, setSelectedSubmodels] = React.useState<number[]>([]);

    const [loadingStatus, setLoadingStatus] = React.useState<string>('');
    const [processing, setProcessing] = React.useState(false);

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

    React.useEffect(() => {
        selectionManager.addChangeListener((model, submodelIDs, toggle, extend) => {
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
        });
    }, [selectionManager, selectedModel, selectedSubmodels]);

    return (
        <EditorContext.Provider
            value={{
                processing,
                setProcessing,
                scene,
                renderer,
                activeView: 0,
                models,
                setModels,
                selectedModel,
                setSelectedModel,
                loadingStatus,
                setLoadingStatus,
                selectedSubmodels,
                setSelectedSubmodels,
                selection: selectionManager,
            }}
        >
            {props.children}
        </EditorContext.Provider>
    );
}

interface EditorViewerContextProps {
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

export const EditorViewerContext = React.createContext<EditorViewerContextProps>(
    {} as EditorViewerContextProps
);

export function ViewContextComponent(props: { children: React.ReactNode }) {
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(true);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);

    return (
        <EditorViewerContext.Provider
            value={{
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
        </EditorViewerContext.Provider>
    );
}
