import { vec3 } from 'gl-matrix';
import React from 'react';

import { exportModel } from '@utils/formats/metacity/write';
import { ModelGraph } from '@utils/hierarchy/graph';
import { EditorModel } from '@utils/models/EditorModel';
import { EditorModelData, addTriangleModel } from '@utils/models/TriangleModel';
import { CoordinateMode, alignModels } from '@utils/modifiers/alignVertices';
import { joinModels } from '@utils/modifiers/joinModels';
import { joinSubmodels } from '@utils/modifiers/joinSubmodels';
import { removeSubmodels } from '@utils/modifiers/removeSubmodels';
import { splitModel } from '@utils/modifiers/splitModels';
import { MetadataNode, PrimitiveType } from '@utils/types';
import { SelectionType } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { SelectFunction, context } from './Context';
import { changeSelection } from './selection';

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

export function useGraph(): [ModelGraph, React.Dispatch<React.SetStateAction<ModelGraph>>] {
    const ctx = React.useContext(context);
    return [ctx.graph, ctx.setGraph];
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
            if (model.hierarchy) ctx.graph.addModel(glmodel, model.hierarchy.root);
        }

        ctx.setGlobalShift(shift);
        ctx.graph.needsUpdate = true;
        return createdModels;
    };

    return create;
}

export function useRemoveModels() {
    const ctx = React.useContext(context);
    const [select] = useSelection();

    const remove = (models: EditorModel) => {
        ctx.scene.remove(models);
        ctx.graph.removeModel(models);
        ctx.graph.needsUpdate = true;
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
        ctx.graph.removeSubmodels(model, submodels);

        const glmodel = await importModel(data);
        if (!glmodel) return;
        ctx.scene.add(glmodel);
        ctx.graph.updateModel(model, glmodel);

        ctx.scene.remove(model);
        ctx.graph.needsUpdate = true;
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
        const { models, submodelIDs } = data;
        const [modelA, modelB] = models;
        const [submodelIDsA, submodelIDsB] = submodelIDs;

        let glmodel = await importModel(modelA);
        if (!glmodel) return;
        ctx.scene.add(glmodel);
        ctx.graph.updateModel(oldModel, glmodel, submodelIDsA);

        glmodel = await importModel(modelB);
        if (!glmodel) return;
        ctx.scene.add(glmodel);
        ctx.graph.updateModel(oldModel, glmodel, submodelIDsB);

        ctx.scene.remove(oldModel);
        ctx.graph.needsUpdate = true;
        select(new Map());
    };

    return split;
}

export function useJoinSubmodels() {
    const ctx = React.useContext(context);
    const [select] = useSelection();

    const join = async (model: EditorModel, submodels: Set<number>) => {
        const newSubmodelId = await joinSubmodels(model, submodels);
        if (!newSubmodelId) return;
        const data = ctx.graph.getMetadata(model, submodels);
        submodels.delete(newSubmodelId);
        const node = ctx.graph.getModel(model, newSubmodelId);
        if (!node) return;
        node.data = data;
        ctx.graph.removeSubmodels(model, submodels);
        ctx.graph.needsUpdate = true;
        select(new Map([[model, new Set([newSubmodelId])]]));
    };

    return join;
}

export function useExport() {
    const ctx = React.useContext(context);

    const exportProject = async () => {
        const model = await joinModels(ctx.models, ctx.graph);
        if (!model) return;
        exportModel(model);
    };

    return exportProject;
}

export function useMetadata(): MetadataNode {
    const { metadata } = React.useContext(context);
    return metadata;
}

export function useLevel(): [number, React.Dispatch<React.SetStateAction<number>>] {
    const ctx = React.useContext(context);
    return [ctx.level, ctx.setLevel];
}
