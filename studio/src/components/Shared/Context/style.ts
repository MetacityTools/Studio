import { vec3 } from 'gl-matrix';

import { parseColor, sampleColor } from '@utils/modifiers/color';
import { StyleNode } from '@utils/types';
import { EditorModel } from '@utils/utils';

export function findStyleKeychain(
    node: StyleNode,
    target: StyleNode,
    nodeKey?: string
): null | string[] {
    if (node === target) {
        if (nodeKey) return [nodeKey];
        return [];
    }
    if (!node.children) return null;

    for (const [key, value] of Object.entries(node.children)) {
        const path = findStyleKeychain(value, target, key);
        if (path) {
            if (nodeKey) return [nodeKey, ...path];
            return path;
        }
    }

    return null;
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

export function colorize(keychain: string[], style: StyleNode, models: EditorModel[]) {
    models.forEach((model) => {
        const metadata = model.metadata;
        const submodels = Object.keys(metadata).map((key) => parseInt(key));
        const colormap = new Map<number, vec3>();

        const randomize = style.style?.random;
        const scalars = style.style?.scalars;
        const strings = style.style?.categories;

        const scalarMap = scalars?.colormap
            .map((color) => parseColor(color))
            .filter((color) => color !== undefined) as vec3[] | undefined;

        for (let submodel of submodels) {
            let submodelData = metadata[submodel];
            const value = getValue(submodelData, keychain);
            if (value === undefined) continue;
            if (randomize) colormap.set(submodel, [Math.random(), Math.random(), Math.random()]);
            else if (typeof value === 'number') {
                if (scalars && scalarMap) {
                    const indicator = (value - scalars.min) / (scalars.max - scalars.min);
                    const color = sampleColor(scalarMap, indicator);
                    colormap.set(submodel, color);
                }
            } else if (typeof value === 'string') {
                if (strings) {
                    const color = parseColor(strings[value]);
                    if (color) colormap.set(submodel, color);
                }
            }
        }

        //apply colormap
        model.setColorMap(colormap);
    });
}