import { Metadata } from '@data/types';

import { SelectionType } from '@context/ViewContext';

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

export function assignDataNoDelete(selection: SelectionType, edits: any) {
    selection.forEach((submodels, model) => {
        submodels.forEach((submodel) => {
            if (model.metadata[submodel] === undefined) model.metadata[submodel] = {};
            const data = model.metadata[submodel];
            if (edits) recursiveAdd(data, edits);
        });
    });
}

export function recursiveExtractMetadata(data: any, tree: Metadata) {
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

export function filterMetadata(metadata: Metadata, nodeKey: string, query: string) {
    if (!query) return metadata;
    if (nodeKey.toLowerCase().includes(query.toLowerCase())) return metadata;

    const copy: Metadata = {};
    const children = new Map<string, Metadata>();
    const values: any[] = [];

    if (metadata.children) {
        metadata.children.forEach((child, key) => {
            const filteredChild = filterMetadata(child, key, query);
            if (filteredChild.children || filteredChild.values) children.set(key, filteredChild);
        });
    }

    if (metadata.values) {
        metadata.values.forEach((value) => {
            if (value.toString().toLowerCase().includes(query.toLowerCase())) values.push(value);
        });
    }

    if (children.size > 0) copy.children = children;
    if (values.length > 0) copy.values = values;
    return copy;
}

export function getValue(data: any, keychain: string[]) {
    let value = data;
    for (const key of keychain) {
        if (value === undefined) return undefined;
        value = value[key];
    }

    if (typeof value === 'object') return undefined;
    return value;
}

export function combineData(selection: SelectionType) {
    let recordCount = 0;
    const aggregated: Metadata = {};

    selection.forEach((submodels, model) => {
        submodels.forEach((submodel) => {
            const data = model.metadata[submodel] ?? {};
            recursiveExtractMetadata(data, aggregated);
            recordCount++;
        });
    });

    if (recordCount === 0) return { aggregated: {}, common: {} };
    const common = extractCommonData(aggregated, recordCount);
    return { common };
}

function extractCommonData(node: Metadata, expectedRecordCount: number) {
    if (node.children && node.values) {
        //node has both children and values - no need to extract
        return undefined;
    } else if (node.children) {
        const extracted: any = {};
        //node has children but no values - extract all children
        for (const [key, child] of node.children) {
            const value = extractCommonData(child, expectedRecordCount);
            if (value !== undefined) extracted[key] = value;
        }

        if (Object.keys(extracted).length === 0) return undefined;
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

function checkChildren(node: Metadata): asserts node is Metadata & { children: {} } {
    if (!node.children) node.children = new Map();
}

function checkValues(node: Metadata): asserts node is Metadata & { values: any[] } {
    if (!node.values) node.values = [];
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
