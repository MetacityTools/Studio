import React from 'react';

import { getStyle } from '@utils/style';

import { Histogram, Metadata, Style } from '@data/types';

import { context } from '@context/ViewContext';

export function useStyle(): [Histogram | undefined, Style | undefined] {
    const ctx = React.useContext(context);

    if (!ctx.usedStyle) return [undefined, undefined];

    const histogram = getHistogram(ctx.metadata, ctx.usedStyle);
    const style = getStyle(ctx.styles, ctx.usedStyle);

    return [histogram, style];
}

function getHistogram(metadata: Metadata, keychain: string[]): Histogram | undefined {
    const HIST_SIZE = 256;
    const histogram: number[] = new Array(HIST_SIZE).fill(0);

    const node = findNode(metadata, keychain);
    if (!node) return;

    if (node.values) {
        let min = Infinity;
        let max = -Infinity;
        for (const value of node.values) {
            if (typeof value === 'number') {
                if (value < min) min = value;
                if (value > max) max = value;
            }
        }

        if (min === Infinity || max === -Infinity) return;

        let range = max - min;
        if (range === 0) range = 1;

        for (const value of node.values) {
            if (typeof value === 'number') {
                const index = Math.floor(((value - min) / range) * (HIST_SIZE - 1));
                histogram[index]++;
            }
        }
        return { min, max, histogram };
    }
}

function findNode(node: Metadata, keychain: string[]) {
    let value: Metadata | undefined = node;
    for (const key of keychain) {
        if (value === undefined) return undefined;
        value = value.children?.get(key);
    }
    return value;
}
