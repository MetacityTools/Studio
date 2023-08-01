import { vec3 } from 'gl-matrix';
import React from 'react';

//TODO refactor the exports from utils
import { exportModel } from '@utils/formats/metacity/write';
import { EditorModel } from '@utils/models/EditorModel';
import { EditorModelData, addTriangleModel } from '@utils/models/TriangleModel';
import { CoordinateMode, alignModels } from '@utils/modifiers/alignVertices';
import { sampleColor } from '@utils/modifiers/color';
import { extractModels } from '@utils/modifiers/extractModels';
import { joinSubmodels } from '@utils/modifiers/joinSubmodels';
import { removeSubmodels } from '@utils/modifiers/removeSubmodels';
import { splitModel } from '@utils/modifiers/splitModels';
import { Histogram, MetadataNode, PrimitiveType, StyleNode } from '@utils/types';
import { autoUpdateStyle, projectModels } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { SelectFunction, Tooltip, context } from './Context';
import { extractMetadata, filterSubmodels, findKeychain, getHistogram } from './metadata';
import { SelectionType, changeSelection } from './selection';
import { colorize, findStyleKeychain, getStyle, whiten } from './style';

export function useActiveView(): number {
    const ctx = React.useContext(context);
    return ctx.activeView;
}

export function useScene(): GL.Scene {
    const ctx = React.useContext(context);
    return ctx.scene;
}

export function useRenderer(): GL.Renderer {
    const ctx = React.useContext(context);
    return ctx.renderer;
}

export function useModels(): EditorModel[] {
    const ctx = React.useContext(context);
    return ctx.models;
}

export function useSelection(): [SelectFunction, SelectionType] {
    const ctx = React.useContext(context);

    const select = (seleciton: SelectionType, toggle: boolean = false, extend: boolean = false) => {
        const newSelection = changeSelection(ctx.selection, seleciton, toggle, extend);
        ctx.setSelection(newSelection);
    };

    return [select, ctx.selection];
}

export function useSelectedModels(): SelectionType {
    const ctx = React.useContext(context);
    return ctx.selection;
}

export function useTooltip(): [
    Tooltip | null,
    React.Dispatch<React.SetStateAction<Tooltip | null>>
] {
    const ctx = React.useContext(context);
    return [ctx.tooltip, ctx.setTooltip];
}

export function useCameraZ(): [number, React.Dispatch<React.SetStateAction<number>>] {
    const ctx = React.useContext(context);
    return [ctx.camTargetZ, ctx.setCamTargetZ];
}

export function useShadeRange(): [
    number,
    number,
    React.Dispatch<React.SetStateAction<number>>,
    React.Dispatch<React.SetStateAction<number>>
] {
    const ctx = React.useContext(context);
    return [ctx.minShade, ctx.maxShade, ctx.setMinShade, ctx.setMaxShade];
}

export function useGridVisible(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.gridVisible, ctx.setGridVisible];
}

export function useGlobalShift(): [vec3 | null, React.Dispatch<React.SetStateAction<vec3 | null>>] {
    const ctx = React.useContext(context);
    return [ctx.globalShift, ctx.setGlobalShift];
}

export interface EditorImportOptions {
    coordMode?: CoordinateMode;
}

async function importModel(model: EditorModelData) {
    if (model.metadata.primitive === PrimitiveType.TRIANGLES) {
        return await addTriangleModel(model);
    }
}

export function useCreateModels() {
    const ctx = React.useContext(context);

    const create = async (data: EditorModelData[], options?: EditorImportOptions) => {
        let shift = ctx.globalShift;
        let coordMode = options?.coordMode ?? CoordinateMode.None;
        const createdModels = [];

        //sort out the alignment
        for (const model of data) shift = alignModels(model.geometry.position, coordMode, shift);

        //generate geometry and metadata
        for (const model of data) {
            const glmodel = await importModel(model);
            if (!glmodel) continue;
            ctx.scene.add(glmodel);
            createdModels.push(glmodel);
        }

        ctx.setGlobalShift(shift);
        return createdModels;
    };

    return create;
}

export function useRemoveModels() {
    const ctx = React.useContext(context);
    const [select] = useSelection();

    const remove = (models: EditorModel) => {
        ctx.scene.remove(models);
        select(new Map());
    };

    return remove;
}

export function useRemoveSubmodels() {
    const ctx = React.useContext(context);
    const [select] = useSelection();

    const remove = async (model: EditorModel, submodels: Set<number>) => {
        const data = removeSubmodels(model, submodels);
        if (!data) return;
        if (data.geometry.position.length > 0) {
            const glmodel = await importModel(data);
            if (!glmodel) return;
            ctx.scene.add(glmodel);
        }
        ctx.scene.remove(model);
        select(new Map());
    };

    return remove;
}

export function useSplitModel() {
    const ctx = React.useContext(context);
    const [select] = useSelection();

    const split = async (oldModel: EditorModel, submodels: Set<number>) => {
        const data = splitModel(oldModel, submodels);
        if (!data) return;
        const [modelA, modelB] = data;

        let glmodel = await importModel(modelA);
        if (!glmodel) return;
        ctx.scene.add(glmodel);

        glmodel = await importModel(modelB);
        if (!glmodel) return;
        ctx.scene.add(glmodel);

        ctx.scene.remove(oldModel);
        select(new Map());
    };

    return split;
}

export function useJoinSubmodels() {
    const [select] = useSelection();

    const join = async (model: EditorModel, submodels: Set<number>) => {
        const newSubmodelId = await joinSubmodels(model, submodels);
        if (!newSubmodelId) return;
        select(new Map([[model, new Set([newSubmodelId])]]));
    };

    return join;
}

export function useProjectModels() {
    const ctx = React.useContext(context);

    const mapping = async (source: EditorModel, target: EditorModel) => {
        console.log(source, target);
        //projeciton map
        const mappedModel = await projectModels(source, target);

        //add the new model
        let glmodel = await importModel(mappedModel);
        if (!glmodel) return;
        ctx.scene.add(glmodel);
    };

    return mapping;
}

export function useExport() {
    const ctx = React.useContext(context);

    const exportProject = async (title: string) => {
        const models = await extractModels(ctx.models);
        if (!models) return;
        exportModel(models, ctx.styles, title);
    };

    return exportProject;
}

export function useMetadata(): [MetadataNode, () => void] {
    const { metadata, setMetadata, models } = React.useContext(context);

    const update = () => {
        const data = extractMetadata(models);
        setMetadata(data);
    };

    return [metadata, update];
}

export function useSelectionByMetadata() {
    const { models } = React.useContext(context);
    const [select] = useSelection();

    const selectByMetadata = (
        root: MetadataNode,
        metadata: MetadataNode,
        value: any,
        extend: boolean = false
    ) => {
        const path = findKeychain(root, metadata);
        if (!path) return;
        const newSelection = new Map();
        for (const model of models) {
            const submodels = filterSubmodels(model, path, value);
            if (submodels.size) newSelection.set(model, submodels);
        }
        select(newSelection, false, extend);
    };

    return selectByMetadata;
}

export function useKeymap() {
    const ctx = React.useContext(context);
    return ctx.renderer.controls?.keyboard.keyMap;
}

export function useStyle(): [StyleNode, (style: StyleNode) => void] {
    const ctx = React.useContext(context);

    const setStyle = (style: StyleNode) => {
        ctx.setStyles(style);
        const usedStyle = ctx.usedStyle;
        if (!usedStyle) return;
        colorize(usedStyle, style, ctx.models);
    };

    return [ctx.styles, setStyle];
}

export function useApplyStyle() {
    const ctx = React.useContext(context);

    const applyStyle = (root: StyleNode, style: StyleNode) => {
        const keychain = findStyleKeychain(root, style);
        if (!keychain) return;
        ctx.setUsedStyle(keychain);
        ctx.setLastUsedStyle(keychain);
        colorize(keychain, root, ctx.models);
    };

    return applyStyle;
}

export function useStyleKeychain() {
    const ctx = React.useContext(context);
    return ctx.usedStyle;
}

export function useClearStyle() {
    const ctx = React.useContext(context);

    const clearStyle = () => {
        ctx.setUsedStyle(null);
        whiten(ctx.models);
    };

    return clearStyle;
}

export function useLastStyle(): [string[] | null, () => void] {
    const ctx = React.useContext(context);

    const applyLastStyle = () => {
        ctx.setUsedStyle(ctx.lastUsedStyle);
        if (!ctx.lastUsedStyle) return;
        colorize(ctx.lastUsedStyle, ctx.styles, ctx.models);
    };

    return [ctx.lastUsedStyle, applyLastStyle];
}

export function useAddMissingStyles() {
    const ctx = React.useContext(context);
    const [, setStyle] = useStyle();

    const update = () => {
        const updated = autoUpdateStyle(ctx.metadata, ctx.styles);
        setStyle(updated);
    };

    return update;
}

export function useGrayscale(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.grayscale, ctx.setGrayscale];
}

export function useDarkmode(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.darkmode, ctx.setDarkmode];
}

export function useStyleInfo(): [Histogram | undefined, StyleNode | undefined] {
    const ctx = React.useContext(context);

    if (!ctx.usedStyle) return [undefined, undefined];

    const histogram = getHistogram(ctx.metadata, ctx.usedStyle);
    const style = getStyle(ctx.styles, ctx.usedStyle);

    return [histogram, style];
}

export function useMetadatHeatmap(): [() => void, () => void] {
    const ctx = React.useContext(context);

    const MAX_META = 20;
    const colormap: vec3[] = [
        [1.0, 1.0, 1.0],
        [0.196, 0.705, 1.0],
    ];

    const colorize = () => {
        for (const model of ctx.models) {
            const meta = model.metadata;
            const submodels = model.submodelIDs;

            const cmap = new Map<number, vec3>();
            for (const id of submodels) {
                const data = meta[id];
                if (!data) {
                    cmap.set(id, [1.0, 1.0, 1.0]);
                    continue;
                }
                const keys = Math.min(Object.keys(data).length, MAX_META);
                cmap.set(id, sampleColor(colormap, keys / MAX_META));
            }

            model.setColorMap(cmap);
        }
    };

    const reset = () => {
        whiten(ctx.models);
    };

    return [colorize, reset];
}
