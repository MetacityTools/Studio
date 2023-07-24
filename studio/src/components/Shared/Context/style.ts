import { vec3 } from 'gl-matrix';

import { getColorMap, parseColor, sampleColor } from '@utils/modifiers/color';
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

export function getStyle(node: StyleNode, keychain: string[]) {
    let value: StyleNode | undefined = node;
    for (const key of keychain) {
        if (value === undefined) return undefined;
        value = value.children?.[key];
    }

    return value;
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

function parseMap(map: string[] | undefined) {
    if (!map) return undefined;
    return map.map((color) => parseColor(color)).filter((color) => color !== undefined) as vec3[];
}

export function colorize(keychain: string[], styles: StyleNode, models: EditorModel[]) {
    const style = getStyle(styles, keychain);
    if (!style) return;

    models.forEach((model) => {
        const metadata = model.metadata;
        const submodels = Object.keys(metadata).map((key) => parseInt(key));
        const colormap = new Map<number, vec3>();

        const randomize = style.style?.random;
        const scalars = style.style?.scalars;
        const strings = style.style?.categories;
        let range = scalars ? scalars.max - scalars.min : undefined;
        if (range === 0) range = 1;

        let scalarMap: vec3[] | undefined = undefined;
        if (typeof scalars?.colormap === 'string') {
            scalarMap = parseMap(getColorMap(scalars.colormap));
        } else if (Array.isArray(scalars?.colormap)) {
            scalarMap = parseMap(scalars?.colormap);
        }

        for (let submodel of submodels) {
            let submodelData = metadata[submodel];
            const value = getValue(submodelData, keychain);
            if (value === undefined) continue;
            if (randomize) colormap.set(submodel, [Math.random(), Math.random(), Math.random()]);
            else if (typeof value === 'number' && isFinite(value)) {
                if (scalars && scalarMap && range) {
                    const indicator = (value - scalars.min) / range;
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

export function whiten(models: EditorModel[]) {
    models.forEach((model) => {
        model.whiten();
    });
}
