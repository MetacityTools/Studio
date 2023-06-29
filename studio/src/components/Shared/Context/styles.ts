import colormap from 'colormap';
import { vec3 } from 'gl-matrix';
import React from 'react';

import { linearInterpolateColor } from '@utils/modifiers/color';
import {
    ColorKeyMap,
    MetadataNode,
    MetadataNumberValue,
    MetadataStringValue,
    MetadataType,
    Style,
} from '@utils/types';

import { context } from './Context';

function findKeychain(node: MetadataNode, target: MetadataNode, nodeKey?: string): string[] | null {
    if (node === target) {
        if (nodeKey) return [nodeKey];
        return [];
    }
    if (!node.children) return null;

    for (const [key, value] of Object.entries(node.children)) {
        const path = findKeychain(value, target, key);
        if (path) {
            if (nodeKey) return [nodeKey, ...path];
            return path;
        }
    }

    return null;
}

export function useStyleKeychain(): [string[], (value: string[] | MetadataNode) => void] {
    const ctx = React.useContext(context);

    const setKeychain = (value: string[] | MetadataNode) => {
        if (Array.isArray(value)) {
            ctx.setStyleKeychain(value);
            return;
        } else {
            const keychain = findKeychain(ctx.metadata, value);
            if (keychain) ctx.setStyleKeychain(keychain);
        }
    };

    return [ctx.styleKeychain, setKeychain];
}

function findNode(node: MetadataNode, keychain: string[]): MetadataNode | null {
    if (keychain.length === 0) return node;
    if (!node.children) return null;

    const [key, ...rest] = keychain;
    const child = node.children[key];
    if (!child) return null;

    return findNode(child, rest);
}

function equalKeychains(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
}

function findLimits(values: number[]) {
    let min = Infinity;
    let max = -Infinity;
    values.forEach((value: any) => {
        min = Math.min(min, value);
        max = Math.max(max, value);
    });
    return [min, max];
}

function defaultNumberStyle(values: MetadataNumberValue, keychain: string[]): Style {
    const unique = new Set<number>(values.values);
    const cm: vec3[] = colormap({
        colormap: 'viridis',
        nshades: 9,
        format: 'float',
    }).map((c) => vec3.fromValues(c[0], c[1], c[2]));

    const map: ColorKeyMap = {};
    const [min, max] = findLimits(values.values);
    let range = max - min;
    if (range === 0) range = 1;

    unique.forEach((value) => {
        map[value] = linearInterpolateColor(cm, (value - min) / range);
    });

    return { keychain, map };
}

function defaultStringStyle(values: MetadataStringValue, keychain: string[]): Style {
    const unique = new Set<string>(values.values);
    const cm: vec3[] = colormap({
        colormap: 'hsv',
        nshades: 15,
        format: 'float',
    }).map((c) => vec3.fromValues(c[0], c[1], c[2]));

    const map: ColorKeyMap = {};

    let i = 0;
    unique.forEach((value) => {
        map[value] = linearInterpolateColor(cm, i++ / unique.size);
    });

    return { keychain, map };
}

function defaultStyle(node: MetadataNode, keychain: string[]): Style | null {
    if (!node.values) return null;
    const values = node.values;
    switch (values.type) {
        case MetadataType.NUMBER:
            return defaultNumberStyle(node.values as MetadataNumberValue, keychain);
        case MetadataType.STRING:
            return defaultStringStyle(node.values as MetadataStringValue, keychain);
    }
    return null;
}

export function getStyleFromKeychain(metadata: MetadataNode, styles: Style[], keychain: string[]) {
    if (keychain.length === 0) return null;
    const node = findNode(metadata, keychain);
    if (!node) return null;
    const style = styles.find((style) => equalKeychains(keychain, style.keychain));
    if (!style) return defaultStyle(node, keychain);
    return style;
}

export function useStyles() {
    const { styles, setStyles, metadata } = React.useContext(context);

    const getStyle = (keychain: string[]) => {
        return getStyleFromKeychain(metadata, styles, keychain);
    };

    const setStyle = (keychain: string[], value: Style) => {
        const style = styles.find((style) => equalKeychains(keychain, style.keychain));
        if (style)
            setStyles([
                ...styles.filter((style) => !equalKeychains(keychain, style.keychain)),
                value,
            ]);
        else setStyles([...styles, value]);
    };

    return [getStyle, setStyle, styles] as const;
}

export function useTraverseMetadata() {
    const { metadata } = React.useContext(context);

    const findNodeCall = (keychain: string[]) => {
        const node = findNode(metadata, keychain);
        if (!node) return null;
        return node;
    };

    return findNodeCall;
}
