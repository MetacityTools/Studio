import { EditorModel } from '@utils/models/EditorModel';

import { SelectionType } from './Context';

export function changeSelection(
    oldSelection: SelectionType,
    newSelection: SelectionType,
    toggleSelection: boolean,
    extendSelection: boolean
) {
    if (oldSelection.size > 0) {
        if (toggleSelection) {
            return caseToggleSelection(oldSelection, newSelection);
        } else if (extendSelection) {
            return caseExtendSelection(oldSelection, newSelection);
        } else {
            return caseDifferentUpdate(oldSelection, newSelection);
        }
    } else {
        return caseOnlyNewUpdate(newSelection);
    }
}

function caseToggleSelection(oldSelection: SelectionType, newSelection: SelectionType) {
    const combinedSelection: SelectionType = new Map();
    for (const [oldModel, oldSubmodelIDs] of oldSelection) {
        let newSubmodelIDs = newSelection.get(oldModel);
        if (!newSubmodelIDs) {
            //since it is in the old, it already has to be selected
            combinedSelection.set(oldModel, oldSubmodelIDs);
        } else {
            //make a diff
            const submodelIDs = caseSameModelToggleUpdate(oldModel, oldSubmodelIDs, newSubmodelIDs);
            if (submodelIDs.length > 0) combinedSelection.set(oldModel, new Set(submodelIDs));
            else oldModel.selected = false;
        }
    }

    for (const [newModel, newModelSelection] of newSelection) {
        let found = oldSelection.get(newModel);
        //if the model is not in the old, it has to be selected
        if (!found)
            combinedSelection.set(newModel, caseOnlyNewModelUpdate(newModel, newModelSelection));
    }

    return combinedSelection;
}

function caseExtendSelection(oldSelection: SelectionType, newSelection: SelectionType) {
    const combinedSelection: SelectionType = new Map(oldSelection);
    for (const [newModel, newSubmodelIDs] of newSelection) {
        let oldSubmodelIDs = oldSelection.get(newModel);
        if (!oldSubmodelIDs) {
            combinedSelection.set(newModel, caseOnlyNewModelUpdate(newModel, newSubmodelIDs));
        } else {
            //extend
            const submodelIDs = caseSameModelExtendUpdate(newModel, oldSubmodelIDs, newSubmodelIDs);
            combinedSelection.set(newModel, submodelIDs);
        }
    }

    return combinedSelection;
}

function caseDifferentUpdate(oldSelection: SelectionType, newSelection: SelectionType) {
    for (const [oldModel, oldSelectionIds] of oldSelection) {
        let newSubmodelIDs = newSelection.get(oldModel);
        if (!newSubmodelIDs) {
            oldModel.selected = false;
        } else {
            caseSameModelUpdate(oldModel, oldSelectionIds, newSubmodelIDs);
        }
    }

    for (const [newModel, newModelIDs] of newSelection) {
        let found = oldSelection.get(newModel);
        if (!found) caseOnlyNewModelUpdate(newModel, newModelIDs);
    }

    return newSelection;
}

function caseSameModelToggleUpdate(
    model: EditorModel,
    oldSubmodelIDs: Set<number>,
    newSubmodelIDs: Set<number>
) {
    const toDeselect = [];
    const toSelect = [];
    const toKeep = [];

    for (const id of oldSubmodelIDs) {
        if (newSubmodelIDs.has(id)) toDeselect.push(id);
        else toKeep.push(id);
    }

    for (const id of newSubmodelIDs) {
        if (!oldSubmodelIDs.has(id)) toSelect.push(id);
    }

    model.deselect(new Set(toDeselect));
    model.select(new Set(toSelect));
    return toKeep.concat(toSelect);
}

function caseSameModelExtendUpdate(
    model: EditorModel,
    oldSubmodelIDs: Set<number>,
    newSubmodelIDs: Set<number>
) {
    const toSelect = [];
    for (const id of newSubmodelIDs) {
        if (!oldSubmodelIDs.has(id)) toSelect.push(id);
    }

    model.select(new Set(toSelect));
    toSelect.forEach((id) => oldSubmodelIDs.add(id));
    return oldSubmodelIDs;
}

function caseSameModelUpdate(
    model: EditorModel,
    oldSubmodelIDs: Set<number>,
    newSubmodelIDs: Set<number>
) {
    model.deselect(oldSubmodelIDs);
    model.select(newSubmodelIDs);
    return newSubmodelIDs;
}

function caseOnlyNewUpdate(newSelection: SelectionType) {
    for (const [newModel, newSubmodelIDs] of newSelection)
        caseOnlyNewModelUpdate(newModel, newSubmodelIDs);
    return newSelection;
}

function caseOnlyNewModelUpdate(model: EditorModel, submodelIDs: Set<number>) {
    model.selected = true;
    model.select(submodelIDs);
    return submodelIDs;
}
