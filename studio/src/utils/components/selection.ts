import { EditorModel } from '@utils/models/EditorModel';

export function changeSelection(
    oldModel: EditorModel | null,
    newModel: EditorModel | null,
    oldSubmodelIDs: number[],
    newSubmodelIDs: number[],
    toggleSelection: boolean,
    extendSelection: boolean
) {
    if (oldModel !== null) {
        if (oldModel !== newModel) {
            return caseDifferentModelsUpdate(oldModel, newModel, newSubmodelIDs);
        } else {
            if (toggleSelection)
                return caseSameModelToggleUpdate(oldModel, oldSubmodelIDs, newSubmodelIDs);
            else if (extendSelection)
                return caseSameModelExtendUpdate(oldModel, oldSubmodelIDs, newSubmodelIDs);
            else return caseSameModelUpdate(oldModel, oldSubmodelIDs, newSubmodelIDs);
        }
    } else {
        return caseOnlyNewModelUpdate(newModel, newSubmodelIDs);
    }
}

function caseDifferentModelsUpdate(
    oldModel: EditorModel,
    newModel: EditorModel | null,
    newSubmodelIDs: number[]
) {
    oldModel.selected = false;
    return caseOnlyNewModelUpdate(newModel, newSubmodelIDs);
}

function caseSameModelToggleUpdate(
    model: EditorModel,
    oldSubmodelIDs: number[],
    newSubmodelIDs: number[]
) {
    const oldSet = new Set(oldSubmodelIDs);
    const newSet = new Set(newSubmodelIDs);
    const toDeselect = [];
    const toSelect = [];
    const toKeep = [];

    for (const id of oldSet) {
        if (newSet.has(id)) toDeselect.push(id);
        else toKeep.push(id);
    }

    for (const id of newSet) {
        if (!oldSet.has(id)) toSelect.push(id);
    }

    model.deselect(toDeselect);
    model.select(toSelect);
    return toKeep.concat(toSelect);
}

function caseSameModelExtendUpdate(
    model: EditorModel,
    oldSubmodelIDs: number[],
    newSubmodelIDs: number[]
) {
    const oldSet = new Set(oldSubmodelIDs);

    const toSelect = [];
    for (const id of newSubmodelIDs) {
        if (!oldSet.has(id)) toSelect.push(id);
    }

    model.select(toSelect);
    return oldSubmodelIDs.concat(toSelect);
}

function caseSameModelUpdate(
    model: EditorModel,
    oldSubmodelIDs: number[],
    newSubmodelIDs: number[]
) {
    model.deselect(oldSubmodelIDs);
    model.select(newSubmodelIDs);
    return newSubmodelIDs;
}

function caseOnlyNewModelUpdate(newModel: EditorModel | null, newSubmodelIDs: number[]) {
    if (newModel !== null) {
        newModel.selected = true;
        newModel.select(newSubmodelIDs);
        return newSubmodelIDs;
    } else {
        return [];
    }
}
