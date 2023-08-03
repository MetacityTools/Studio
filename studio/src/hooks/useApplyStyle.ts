import { vec3 } from 'gl-matrix';
import React from 'react';

import { getColorMap, parseColor, sampleColor } from '@utils/color';
import { getStyle } from '@utils/style';

import { EditorModel } from '@data/EditorModel';
import { Style } from '@data/types';

import { context } from '@context/ViewContext';

export function useApplyStyle(): [
    (root: Style, style: Style) => void,
    (keychain: string[]) => void
] {
    const ctx = React.useContext(context);

    const applyStyle = (root: Style, style: Style) => {
        let keychain = findStyleKeychain(root, style);
        if (!keychain) return;
        ctx.setUsedStyle(keychain);
        ctx.setLastUsedStyle(keychain);
        colorize(keychain, style, ctx.models);
    };

    const applyKeychain = (keychain: string[]) => {
        const style = getStyle(ctx.styles, keychain) as Style;
        if (!style) return;
        ctx.setUsedStyle(keychain);
        ctx.setLastUsedStyle(keychain);
        colorize(keychain, style, ctx.models);
    };

    return [applyStyle, applyKeychain];
}

function findStyleKeychain(node: Style, target: Style, nodeKey?: string): undefined | string[] {
    if (node === target) {
        if (nodeKey) return [nodeKey];
        return [];
    }
    if (!node.children) return undefined;

    for (const [key, value] of Object.entries(node.children)) {
        const path = findStyleKeychain(value, target, key);
        if (path) {
            if (nodeKey) return [nodeKey, ...path];
            return path;
        }
    }

    return;
}

function colorize(keychain: string[], style: Style, models: EditorModel[]) {
    models.forEach((model) => {
        const metadata = model.metadata;
        const submodels = Object.keys(metadata).map((key) => parseInt(key));
        const colormap = new Map<number, vec3>();

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
        model.uniforms['uUseShading'] = 0.1;
    });
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

function parseMap(map: string[] | undefined) {
    if (!map) return undefined;
    return map.map((color) => parseColor(color)).filter((color) => color !== undefined) as vec3[];
}
