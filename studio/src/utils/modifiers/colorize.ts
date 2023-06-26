import { vec3 } from 'gl-matrix';

import { EditorModel, ModelGraph, Style } from '@utils/utils';

export function colorize(model: EditorModel, graph: ModelGraph, keychain: string[], style: Style) {
    const valueMap = graph.getKeyValueMap(model, keychain, 1);
    const colorMap = new Map<number, vec3>();

    valueMap.forEach((value: number | string, key) => {
        if (style.map[value]) colorMap.set(key, style.map[value]);
        else colorMap.set(key, [255, 255, 255]);
    });

    model.setColorMap(colorMap);
}

export function whiten(model: EditorModel) {
    model.whiten();
}
