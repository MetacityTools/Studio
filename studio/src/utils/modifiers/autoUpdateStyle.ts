import { MetadataNode, StyleNode } from '@utils/types';

export function autoUpdateStyle(metadata: MetadataNode, style: StyleNode) {
    if (metadata.values) {
        //add missing values
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
                    colormap: 'plasma',
                    min,
                    max,
                };
        } else {
            if (style.style.scalars) delete style.style.scalars;
        }

        if (categorical.size > 0) {
            if (!style.style.categories) style.style.categories = {};
            categorical.forEach((value) => {
                if (!style.style!.categories![value]) style.style!.categories![value] = '#eeeeee'; //randomColor();
            });

            const categories = Object.keys(style.style.categories);

            for (let i = 0; i < categories.length; i++) {
                if (!categorical.has(categories[i])) delete style.style.categories[categories[i]];
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
