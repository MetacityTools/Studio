import { ModelData } from 'types';

import { unindexModel } from '../formats/ifc/unindex';

export function computeIdealGrid(models: ModelData) {
    //TODO adjust for multiple geometries
    //const aligned = alignGeometry(models.data);
    //const bbox = boundingBox(aligned[0]);
    //const grid = resolution(bbox);
    //console.log(grid);
}

function resolution(bbox: { min: number[]; max: number[] }) {
    const unit = 1;
    const dx = bbox.max[0] - bbox.min[0];
    const dy = bbox.max[1] - bbox.min[1];
    const dz = bbox.max[2] - bbox.min[2];

    const nx = Math.ceil(dx / unit);
    const ny = Math.ceil(dy / unit);
    const nz = Math.ceil(dz / unit);
    return {
        nx,
        ny,
        nz,
        unit,
    };
}

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

function boundingBox(vertices: Float32Array) {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];

        min[0] = Math.min(min[0], x);
        min[1] = Math.min(min[1], y);
        min[2] = Math.min(min[2], z);

        max[0] = Math.max(max[0], x);
        max[1] = Math.max(max[1], y);
        max[2] = Math.max(max[2], z);
    }

    return { min, max };
}
