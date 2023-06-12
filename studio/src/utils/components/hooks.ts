import { vec3 } from 'gl-matrix';
import React from 'react';

import { ModelGraph } from '@utils/hierarchy/graph';
import { EditorModel } from '@utils/models/EditorModel';
import { addTriangleModel } from '@utils/models/TriangleModel';
import { CoordinateMode, alignModels } from '@utils/modifiers/alignVertices';
import { removeSubmodels } from '@utils/modifiers/removeSubmodels';
import { PrimitiveType } from '@utils/types';
import { EditorModelData, joinSubmodels, splitModel } from '@utils/utils';

import * as GL from '@bananagl/bananagl';

import { SelectFunction, SelectionType, context } from './Context';
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

/**
 * A hook that returns an array containing the current models, the selected model, and the selected submodels.
 * @returns An array containing the current models, the selected model, and the selected submodels.
 */
export function useModels(): EditorModel[] {
    const ctx = React.useContext(context);
    return ctx.models;
}

/**
 * A hook that returns an array containing the currently selected model, an array of selected submodel IDs, and a function to update the selection.
 * @returns An array containing the currently selected model, an array of selected submodel IDs, and a function to update the selection.
 */
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

export function useCreateModels() {
    const ctx = React.useContext(context);

    const create = async (data: EditorModelData[], options?: EditorImportOptions) => {
        let shift = ctx.globalShift;
        let coordMode = options?.coordMode ?? CoordinateMode.None;

        //sort out the alignment
        for (const model of data) shift = alignModels(model.geometry.position, coordMode, shift);

        //generate geometry and metadata
        for (const model of data) {
            if (model.metadata.primitive === PrimitiveType.TRIANGLES) {
                let glmodel = await addTriangleModel(model);
                ctx.scene.add(glmodel);
                ctx.graph.addModel(glmodel, model.metadata.data);
            }
        }

        ctx.setGlobalShift(shift);
        ctx.graph.needsUpdate = true;
    };

    return create;
}

export function useRemoveModels() {
    const ctx = React.useContext(context);

    const remove = (models: EditorModel) => {
        ctx.scene.remove(models);
        ctx.graph.removeModel(models);
        ctx.graph.needsUpdate = true;
    };

    return remove;
}

export function useRemoveSubmodels() {
    const ctx = React.useContext(context);

    const remove = async (model: EditorModel, submodels: Set<number>) => {
        const data = removeSubmodels(model, submodels);
        if (!data) return;
        ctx.graph.removeSubmodels(model, submodels);

        if (data.metadata.primitive === PrimitiveType.TRIANGLES) {
            let newModel = await addTriangleModel(data);
            ctx.scene.add(newModel);
            ctx.graph.updateModel(model, newModel);
        }

        ctx.scene.remove(model);
        ctx.graph.needsUpdate = true;
    };

    return remove;
}

export function useSplitModel() {
    const ctx = React.useContext(context);

    const split = async (oldModel: EditorModel, submodels: Set<number>) => {
        const data = splitModel(oldModel, submodels);
        if (!data) return;
        const { models, submodelIDs } = data;
        const [modelA, modelB] = models;
        const [submodelIDsA, submodelIDsB] = submodelIDs;

        if (modelA.metadata.primitive === PrimitiveType.TRIANGLES) {
            let newModel = await addTriangleModel(modelA);
            ctx.scene.add(newModel);
            ctx.graph.updateModel(oldModel, newModel, submodelIDsA);
        }

        if (modelB.metadata.primitive === PrimitiveType.TRIANGLES) {
            let newModel = await addTriangleModel(modelB);
            ctx.scene.add(newModel);
            ctx.graph.updateModel(oldModel, newModel, submodelIDsB);
        }

        ctx.scene.remove(oldModel);
        ctx.graph.needsUpdate = true;
    };

    return split;
}

export function useJoinSubmodels() {
    const ctx = React.useContext(context);

    const join = async (model: EditorModel, submodels: Set<number>) => {
        const newSubmodelId = await joinSubmodels(model, submodels);
        if (!newSubmodelId) return;
        submodels.delete(newSubmodelId);
        //TODO merge metadata
        ctx.graph.removeSubmodels(model, submodels);
        ctx.graph.needsUpdate = true;
    };

    return join;
}
