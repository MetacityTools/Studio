import { vec3 } from 'gl-matrix';
import React from 'react';

import { EditorModel } from '@utils/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import { changeSelection } from './selection';

/**
 * A function that updates the selection of models and submodels.
 * @param model The model to select.
 * @param submodelIDs An array of submodel IDs to select.
 * @param toggle A boolean indicating whether to toggle the selection or not.
 * @param extend A boolean indicating whether to extend the selection or not.
 * @returns void
 */
type SelectFunction = (
    model: EditorModel | null,
    submodelIDs?: number[],
    toggle?: boolean,
    extend?: boolean
) => void;

interface ViewContextProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    selectedModel: EditorModel | null;
    setSelectedModel: React.Dispatch<React.SetStateAction<EditorModel | null>>;
    selectedSubmodels: number[];
    setSelectedSubmodels: React.Dispatch<React.SetStateAction<number[]>>;
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

const context = React.createContext<ViewContextProps>({} as ViewContextProps);

function ViewContext(props: { children: React.ReactNode }) {
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

            if (selectedModel !== null && !copy.includes(selectedModel)) setSelectedModel(null);
        };

        scene.addChangeListener(onChange);

        return () => {
            scene.removeChangeListener(onChange);
        };
    }, [scene, selectedModel]);

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

    return (
        <context.Provider
            value={{
                scene,
                renderer,
                activeView: 0,
                models,
                selectedModel,
                setSelectedModel,
                selectedSubmodels,
                setSelectedSubmodels,
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
        </context.Provider>
    );
}

function useViewContext(): ViewContextProps {
    return React.useContext(context);
}

function useActiveView(): number {
    const ctx = React.useContext(context);
    return ctx.activeView;
}

function useScene(): GL.Scene {
    const ctx = React.useContext(context);
    return ctx.scene;
}

function useRenderer(): GL.Renderer {
    const ctx = React.useContext(context);
    return ctx.renderer;
}

/**
 * A hook that returns an array containing the current models, the selected model, and the selected submodels.
 * @returns An array containing the current models, the selected model, and the selected submodels.
 */
function useModels(): EditorModel[] {
    const ctx = React.useContext(context);
    return ctx.models;
}

/**
 * A hook that returns an array containing the currently selected model, an array of selected submodel IDs, and a function to update the selection.
 * @returns An array containing the currently selected model, an array of selected submodel IDs, and a function to update the selection.
 */
function useSelection(): [SelectFunction, EditorModel | null, number[]] {
    const ctx = React.useContext(context);

    const select = (
        model: EditorModel | null,
        submodelIDs: number[] = [],
        toggle: boolean = false,
        extend: boolean = false
    ) => {
        submodelIDs = changeSelection(
            ctx.selectedModel,
            model,
            ctx.selectedSubmodels,
            submodelIDs,
            toggle,
            extend
        );

        ctx.setSelectedModel(model);
        ctx.setSelectedSubmodels(submodelIDs);
    };

    return [select, ctx.selectedModel, ctx.selectedSubmodels];
}

function useSelectedSubmodels(): [number[], React.Dispatch<React.SetStateAction<number[]>>] {
    const ctx = React.useContext(context);
    return [ctx.selectedSubmodels, ctx.setSelectedSubmodels];
}

function useCameraZ(): [number, React.Dispatch<React.SetStateAction<number>>] {
    const ctx = React.useContext(context);
    return [ctx.camTargetZ, ctx.setCamTargetZ];
}

function useShadeRange(): [
    number,
    number,
    React.Dispatch<React.SetStateAction<number>>,
    React.Dispatch<React.SetStateAction<number>>
] {
    const ctx = React.useContext(context);
    return [ctx.minShade, ctx.maxShade, ctx.setMinShade, ctx.setMaxShade];
}

function useGridVisible(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.gridVisible, ctx.setGridVisible];
}

function useGlobalShift(): [vec3 | null, React.Dispatch<React.SetStateAction<vec3 | null>>] {
    const ctx = React.useContext(context);
    return [ctx.globalShift, ctx.setGlobalShift];
}

export {
    ViewContext,
    useViewContext,
    useActiveView,
    useScene,
    useRenderer,
    useModels,
    useSelection,
    useSelectedSubmodels,
    useCameraZ,
    useShadeRange,
    useGridVisible,
    useGlobalShift,
};
