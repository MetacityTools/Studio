import { vec3 } from 'gl-matrix';
import React from 'react';

import { exportModel } from '@utils/formats/metacity/write';
import { EditorModel } from '@utils/models/EditorModel';
import { EditorModelData, addTriangleModel } from '@utils/models/TriangleModel';
import { CoordinateMode, alignModels } from '@utils/modifiers/alignVertices';
import { extractModels } from '@utils/modifiers/extractModels';
import { joinModels } from '@utils/modifiers/joinModels';
import { joinSubmodels } from '@utils/modifiers/joinSubmodels';
import { removeSubmodels } from '@utils/modifiers/removeSubmodels';
import { splitModel } from '@utils/modifiers/splitModels';
import { Histogram, MetadataNode, PrimitiveType, StyleNode } from '@utils/types';

import * as GL from '@bananagl/bananagl';

import { SelectFunction, context } from './Context';
import { extractMetadata, filterSubmodels, findKeychain, getHistogram } from './metadata';
import { SelectionType, changeSelection } from './selection';
import { colorize, findStyleKeychain, getStyle, getValue } from './style';

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

export function useSelectionByMetadata(): (
    root: MetadataNode,
    metadata: MetadataNode,
    value: any,
    extend?: boolean
) => void {
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

export function useStyle(): [StyleNode, React.Dispatch<React.SetStateAction<StyleNode>>] {
    const ctx = React.useContext(context);
    return [ctx.styles, ctx.setStyles];
}

export function useApplyStyle(): [
    string[] | null,
    (root: StyleNode, style: StyleNode) => void,
    () => void
] {
    const ctx = React.useContext(context);

    const applyStyle = (root: StyleNode, style: StyleNode) => {
        const keychain = findStyleKeychain(root, style);
        if (!keychain) return;
        ctx.setUsedStyle(keychain);
    };

    const clearStyle = () => {
        ctx.setUsedStyle(null);
    };

    return [ctx.usedStyle, applyStyle, clearStyle];
}

export function useGrayscale(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.grayscale, ctx.setGrayscale];
}

export function useStyleInfo(): [Histogram | undefined, StyleNode | undefined] {
    const ctx = React.useContext(context);

    if (!ctx.usedStyle) return [undefined, undefined];

    const histogram = getHistogram(ctx.metadata, ctx.usedStyle);
    const style = getStyle(ctx.styles, ctx.usedStyle);

    return [histogram, style];
}

export function useShowMetadataAssigned() {
    const ctx = React.useContext(context);
}
