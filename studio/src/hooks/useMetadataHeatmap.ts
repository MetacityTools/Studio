import { vec3 } from 'gl-matrix';
import React from 'react';

import { sampleColor } from '@utils/color';

import { context } from '@context/ViewContext';

import { useClearStyle } from './useClearStyle';

export function useMetadatHeatmap(): [() => void, () => void] {
    const ctx = React.useContext(context);
    const clearModels = useClearStyle();

    const MAX_META = 20;
    const colormap: vec3[] = [
        [1.0, 1.0, 1.0],
        [0.196, 0.705, 1.0],
    ];

    const apply = () => {
        for (const model of ctx.models) {
            const meta = model.metadata;
            const submodels = model.submodelIDs;

            const cmap = new Map<number, vec3>();
            for (const id of submodels) {
                const data = meta[id];
                if (!data) {
                    cmap.set(id, [1.0, 1.0, 1.0]);
                    continue;
                }
                const keys = Math.min(Object.keys(data).length, MAX_META);
                cmap.set(id, sampleColor(colormap, keys / MAX_META));
            }

            model.setColorMap(cmap);
        }
    };

    const reset = () => {
        clearModels();
    };

    return [apply, reset];
}
