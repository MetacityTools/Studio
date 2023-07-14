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

function getStyle(node: StyleNode, keychain: string[]) {
    let value: StyleNode | undefined = node;
    for (const key of keychain) {
        if (value === undefined) return undefined;
        value = value.children?.[key];
    }

    return value;
}

function getValue(data: any, keychain: string[]) {
    let value = data;
    for (const key of keychain) {
        if (value === undefined) return undefined;
        value = value[key];
    }

    if (typeof value === 'object') return undefined;
    return value;
}

function getMap(map: string) {
    switch (map) {
        case 'plasma':
            return [
                '#0d0887',
                '#350498',
                '#5302a3',
                '#6f00a8',
                '#8b0aa5',
                '#a31e9a',
                '#b83289',
                '#cc4778',
                '#db5c68',
                '#e97158',
                '#f48849',
                '#fba238',
                '#febd2a',
                '#fada24',
                '#f0f921',
            ];
        case 'viridis':
            return [
                '#440154',
                '#481b6d',
                '#46327e',
                '#3f4788',
                '#365c8d',
                '#2e6e8e',
                '#277f8e',
                '#21918c',
                '#1fa187',
                '#2db27d',
                '#4ac16d',
                '#73d056',
                '#a0da39',
                '#d0e11c',
                '#fde725',
            ];
        case 'inferno':
            return [
                '#000004',
                '#0d0829',
                '#280b53',
                '#470b6a',
                '#65156e',
                '#82206c',
                '#9f2a63',
                '#bc3754',
                '#d44842',
                '#e8602d',
                '#f57d15',
                '#fc9f07',
                '#fac228',
                '#f3e55d',
                '#fcffa4',
            ];
        case 'magma':
            return [
                '#000004',
                '#0c0926',
                '#221150',
                '#400f74',
                '#5f187f',
                '#7b2382',
                '#982d80',
                '#b73779',
                '#d3436e',
                '#eb5760',
                '#f8765c',
                '#fd9a6a',
                '#febb81',
                '#fddc9e',
                '#fcfdbf',
            ];
    }
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
            scalarMap = parseMap(getMap(scalars.colormap));
        } else if (Array.isArray(scalars?.colormap)) {
            scalarMap = parseMap(scalars?.colormap);
        }

        for (let submodel of submodels) {
            let submodelData = metadata[submodel];
            const value = getValue(submodelData, keychain);
            if (value === undefined) continue;
            if (randomize) colormap.set(submodel, [Math.random(), Math.random(), Math.random()]);
            else if (typeof value === 'number') {
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
