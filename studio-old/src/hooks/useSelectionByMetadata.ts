import React from 'react';

import { EditorModel } from '@data/EditorModel';
import { Metadata } from '@data/types';

import { context } from '@context/ViewContext';

import { useSelection } from './useSelection';

export function useSelectionByMetadata() {
    const { models } = React.useContext(context);
    const select = useSelection();

    const selectByMetadata = (
        root: Metadata,
        metadata: Metadata,
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

function findKeychain(node: Metadata, target: Metadata, nodeKey?: string): undefined | string[] {
    if (node === target) {
        if (nodeKey) return [nodeKey];
        return [];
    }
    if (!node.children) return;

    for (const [key, value] of node.children.entries()) {
        const path = findKeychain(value, target, key);
        if (path) {
            if (nodeKey) return [nodeKey, ...path];
            return path;
        }
    }

    return;
}

function filterSubmodels(model: EditorModel, keychain: string[], value: any) {
    const submodels = new Set<number>();
    let parsedId;
    for (const id of Object.keys(model.metadata)) {
        parsedId = parseInt(id);
        if (filterSubmodelRecursive(model.metadata[parsedId], keychain, value))
            submodels.add(parsedId);
    }
    return submodels;
}

function filterSubmodelRecursive(
    metadata: any,
    keychain: string[],
    value: any,
    depth: number = 0
): boolean {
    if (keychain.length === depth) {
        if (metadata === value) return true;
        return false;
    } else {
        const key = keychain[depth];
        const subdata = metadata[key];
        if (subdata === undefined) return false;
        return filterSubmodelRecursive(subdata, keychain, value, depth + 1);
    }
}
