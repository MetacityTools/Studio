import { MetadataNode } from '@utils/types';
import { EditorModel } from '@utils/utils';

import { SelectionType } from './selection';

function deepCopy(obj: any) {
    if (typeof obj !== 'object') return obj;
    if (obj === null) return null;

    //does not take into accoutnt typed arrays and circular references
    const copy: any = Array.isArray(obj) ? [] : {};
    for (const [key, value] of Object.entries(obj)) {
        copy[key] = deepCopy(value);
    }

    return copy;
}

export function combineData(selection: SelectionType) {
    let recordCount = 0;
    const aggregated: MetadataNode = {};

    selection.forEach((submodels, model) => {
        submodels.forEach((submodel) => {
            const data = model.metadata[submodel] ?? {};
            recursiveExtractMetadata(data, aggregated);
            recordCount++;
        });
    });

    if (recordCount === 0) return { aggregated: {}, common: {} };
    const common = extractCommonData(aggregated, {}, recordCount);
    return { aggregated, common };
}

export function extractMetadata(models: EditorModel[]) {
    const aggregated: MetadataNode = {};

    models.forEach((model) => {
        Object.entries(model.metadata).forEach(([key, data]) => {
            recursiveExtractMetadata(data, aggregated);
        });
    });

    return aggregated;
}

function recursiveExtractMetadata(data: any, tree: MetadataNode) {
    if (typeof data === 'object') {
        for (const key in data) {
            checkChildren(tree);
            const child = tree.children.get(key) ?? {};
            recursiveExtractMetadata(data[key], child);
            tree.children.set(key, child);
        }
    } else {
        checkValues(tree);
        tree.values.push(data);
    }
}

function checkChildren(node: MetadataNode): asserts node is MetadataNode & { children: {} } {
    if (!node.children) node.children = new Map();
}

function checkValues(node: MetadataNode): asserts node is MetadataNode & { values: any[] } {
    if (!node.values) node.values = [];
}

function extractCommonData(node: MetadataNode, extracted: any, expectedRecordCount: number) {
    if (node.children && node.values) {
        //node has both children and values - no need to extract
    } else if (node.children) {
        //node has children but no values - extract all children
        for (const [key, child] of node.children) {
            const value = extractCommonData(child, {}, expectedRecordCount);
            if (value !== undefined) extracted[key] = value;
        }
        return extracted;
    } else if (node.values) {
        //node has values but no children - extract values
        const set = new Set(node.values);
        if (set.size === 1 && node.values.length === expectedRecordCount) {
            return set.values().next().value;
        } else {
            return undefined;
        }
    }
}

//------------------------------------------------------------
export function applyEdits(selection: SelectionType, original: any, edits: any) {
    const removed = removedDiff(original, edits);
    const added = addedDiff(original, edits);

    selection.forEach((submodels, model) => {
        submodels.forEach((submodel) => {
            if (model.metadata[submodel] === undefined) model.metadata[submodel] = {};
            const data = model.metadata[submodel];
            if (removed) recursiveRemove(data, removed);
            if (added) recursiveAdd(data, added);
        });
    });
}

function recursiveRemove(data: any, removed: any) {
    for (const key in data) {
        if (removed[key] !== undefined) {
            if (typeof data[key] === 'object') {
                recursiveRemove(data[key], removed[key]);
                if (Object.keys(data[key]).length === 0) delete data[key];
            } else {
                delete data[key];
            }
        }
    }
}

function recursiveAdd(data: any, added: any) {
    for (const key in added) {
        if (typeof added[key] === 'object') {
            if (data[key] === undefined) data[key] = {};
            recursiveAdd(data[key], added[key]);
        } else {
            data[key] = added[key];
        }
    }
}

function removedDiff(original: any, edited: any) {
    if (typeof original === 'object' && typeof edited === 'object') {
        let diff: any = undefined;
        for (const key in original) {
            if (edited[key] !== undefined) {
                const subdiff = removedDiff(original[key], edited[key]);
                if (subdiff !== undefined) {
                    if (!diff) diff = {};
                    diff[key] = subdiff;
                }
            } else {
                if (!diff) diff = {};
                diff[key] = original[key];
            }
        }
        return diff;
    } else if (original !== edited) {
        return original;
    }
}

function addedDiff(original: any, edited: any) {
    if (typeof original === 'object' && typeof edited === 'object') {
        let diff: any = undefined;
        for (const key in edited) {
            if (original[key] !== undefined) {
                const subdiff = addedDiff(original[key], edited[key]);
                if (subdiff !== undefined) {
                    if (!diff) diff = {};
                    diff[key] = subdiff;
                }
            } else {
                if (!diff) diff = {};
                diff[key] = edited[key];
            }
        }
        return diff;
    } else if (original !== edited) {
        return edited;
    }
}
