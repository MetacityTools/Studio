import { vec3 } from 'gl-matrix';

export function alignToOrigin(models: Float32Array[]) {
    const minCoords = [Infinity, Infinity, Infinity];
    models.forEach((model) => {
        for (let i = 0; i < model.length; i += 3) {
            const x = model[i];
            const y = model[i + 1];
            const z = model[i + 2];

            minCoords[0] = Math.min(minCoords[0], x);
            minCoords[1] = Math.min(minCoords[1], y);
            minCoords[2] = Math.min(minCoords[2], z);
        }
    });

    models.forEach((model) => {
        for (let i = 0; i < model.length; i += 3) {
            model[i] -= minCoords[0];
            model[i + 1] -= minCoords[1];
            model[i + 2] -= minCoords[2];
        }
    });

    return models;
}

export function alignToCenter(model: Float32Array, shift: vec3 | null = null) {
    const minCoords = [Infinity, Infinity, Infinity];
    const maxCoords = [-Infinity, -Infinity, -Infinity];

    for (let i = 0; i < model.length; i += 3) {
        const x = model[i];
        const y = model[i + 1];
        const z = model[i + 2];

        minCoords[0] = Math.min(minCoords[0], x);
        minCoords[1] = Math.min(minCoords[1], y);
        minCoords[2] = Math.min(minCoords[2], z);

        maxCoords[0] = Math.max(maxCoords[0], x);
        maxCoords[1] = Math.max(maxCoords[1], y);
        maxCoords[2] = Math.max(maxCoords[2], z);
    }

    const center = [
        (maxCoords[0] + minCoords[0]) / 2,
        (maxCoords[1] + minCoords[1]) / 2,
        (maxCoords[2] + minCoords[2]) / 2,
    ];

    for (let i = 0; i < model.length; i += 3) {
        model[i] -= center[0];
        model[i + 1] -= center[1];
        //model[i + 2] -= center[2];
    }

    if (shift) {
        shift[0] = -center[0];
        shift[1] = -center[1];
        shift[2] = 0;
    }

    return model;
}

export function shiftModel(model: Float32Array, shift: vec3) {
    for (let i = 0; i < model.length; i += 3) {
        model[i] += shift[0];
        model[i + 1] += shift[1];
        model[i + 2] += shift[2];
    }
}
