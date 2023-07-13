import { MetadataNode, StyleNode } from '@utils/types';

import { randomColor } from './color';

export function autoUpdateStyle(metadata: MetadataNode, style: StyleNode) {
    if (metadata.values) {
        const scalars = new Set<number>();
        const categorical = new Set<string>();

        metadata.values.forEach((value) => {
            if (typeof value === 'number') scalars.add(value);
            else if (typeof value === 'string') categorical.add(value);
            else if (typeof value === 'boolean') categorical.add(value.toString());
        });

        if (!style.style) style.style = {};

        if (scalars.size > 0) {
            let min = Infinity;
            let max = -Infinity;

            scalars.forEach((value) => {
                if (value < min) min = value;
                if (value > max) max = value;
            });

            if (style.style.scalars) {
                style.style.scalars.min = min;
                style.style.scalars.max = max;
            } else
                style.style.scalars = {
                    colormap: [
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
                    ],
                    min,
                    max,
                };
        } else {
            if (style.style.scalars) delete style.style.scalars;
        }

        if (categorical.size > 0) {
            if (categorical.size > 500) {
                style.style.random = true;
            } else {
                if (!style.style.categories) style.style.categories = {};
                categorical.forEach((value) => {
                    if (!style.style!.categories![value])
                        style.style!.categories![value] = randomColor();
                });
            }
        } else {
            if (style.style.categories) delete style.style.categories;
        }
    }

    if (metadata.children) {
        if (!style.children) style.children = {};
        metadata.children.forEach((child, key) => {
            if (!style.children![key]) style.children![key] = {};
            autoUpdateStyle(child, style.children![key]);
        });
    }

    return {
        ...style,
    };
}
