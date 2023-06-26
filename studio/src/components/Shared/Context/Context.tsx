import { vec3 } from 'gl-matrix';
import React from 'react';

import {
    EditorModel,
    MetadataNode,
    ModelGraph,
    SelectionType,
    Style,
    colorize,
    extractMetadataTree,
    whiten,
} from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { getStyleFromKeychain } from './styles';

/**
 * A function that updates the selection of models and submodels.
 * @param model The model to select.
 * @param submodelIDs An array of submodel IDs to select.
 * @param toggle A boolean indicating whether to toggle the selection or not.
 * @param extend A boolean indicating whether to extend the selection or not.
 * @returns void
 */
export type SelectFunction = (selection: SelectionType, toggle?: boolean, extend?: boolean) => void;

interface ViewContextProps {
    scene: GL.Scene;
    renderer: GL.Renderer;
    activeView: number;
    models: EditorModel[];
    selection: SelectionType;
    setSelection: React.Dispatch<React.SetStateAction<SelectionType>>;
    graph: ModelGraph;
    setGraph: React.Dispatch<React.SetStateAction<ModelGraph>>;
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
    styleKeychain: string[];
    setStyleKeychain: React.Dispatch<React.SetStateAction<string[]>>;
    styles: Style[];
    setStyles: React.Dispatch<React.SetStateAction<Style[]>>;
}

export const context = React.createContext<ViewContextProps>({} as ViewContextProps);

export function ViewContext(props: { children: React.ReactNode }) {
    const [renderer] = React.useState(new GL.Renderer());
    const [scene] = React.useState(new GL.Scene());
    const [models, setModels] = React.useState<EditorModel[]>([]);
    const [selection, setSelection] = React.useState<SelectionType>(new Map());
    const [graph, setGraph] = React.useState<ModelGraph>(new ModelGraph());
    const [camTargetZ, setCamTargetZ] = React.useState<number>(0);
    const [minShade, setMinShade] = React.useState<number>(0);
    const [maxShade, setMaxShade] = React.useState<number>(10);
    const [gridVisible, setGridVisible] = React.useState<boolean>(true);
    const [globalShift, setGlobalShift] = React.useState<vec3 | null>(null);
    const [metadata, setMetadata] = React.useState<MetadataNode>({});
    const [styleKeychain, setStyleKeychain] = React.useState<string[]>([]);
    const [styles, setStyles] = React.useState<Style[]>([]);
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
        graph.addChangeListener(() => {
            const updated = new ModelGraph();
            updated.copy(graph);
            setGraph(updated);
            const metadata = extractMetadataTree(updated);
            setMetadata(metadata);
        });
    }, [graph]);

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
        const style = getStyleFromKeychain(metadata, styles, styleKeychain);
        if (!style) {
            models.forEach((object) => whiten(object));
        } else {
            models.forEach((object) => {
                colorize(object, graph, styleKeychain, style);
            });
        }
    }, [styleKeychain, styles, metadata, models, graph]);

    return (
        <context.Provider
            value={{
                scene,
                renderer,
                activeView: activeView,
                models,
                selection,
                setSelection,
                graph,
                setGraph,
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
                styleKeychain,
                setStyleKeychain,
                styles,
                setStyles,
            }}
        >
            {props.children}
        </context.Provider>
    );
}
