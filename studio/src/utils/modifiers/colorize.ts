import colormap from 'colormap';
import { vec3 } from 'gl-matrix';

import { EditorModel, ModelGraph } from '@utils/utils';

export function colorize(
    model: EditorModel,
    graph: ModelGraph,
    keyChain: string[],
    min: number,
    max: number
) {
    const map = graph.getKeyValueMap(model, keyChain, 1);
    let range = max - min;
    if (range === 0) range = 1;
    const normalizedValues = new Map<number, number>();
    for (const [id, value] of map.entries()) {
        const color = (value - min) / range;
        normalizedValues.set(id, color);
    }

    const cm: vec3[] = colormap({
        colormap: 'plasma',
        nshades: 10,
        format: 'float',
    }).map((c) => vec3.fromValues(c[0], c[1], c[2]));

    model.setColorMap(normalizedValues, cm);
}

export function whiten(model: EditorModel) {
    model.whiten();
}
