import { vec3 } from 'gl-matrix';

import { IFCModelData } from '@data/types';

export function unindexModel(model: IFCModelData[]) {
    applyMatricesToPositions(model);
    let count = countVertices(model);
    const position = new Float32Array(count * 3);
    const submodel = new Uint32Array(count);
    unindexModelData(model, position, submodel);
    return { position, submodel };
}

function countVertices(models: IFCModelData[]) {
    let countVertices = 0;
    models.forEach((model) => {
        countVertices += model.geometry.index.length;
    });
    return countVertices;
}

function applyMatricesToPositions(models: IFCModelData[]) {
    models.forEach((model) => {
        const position = model.geometry.position;
        const matrix = model.matrix;
        const vec = vec3.create();

        for (let i = 0; i < position.length; i += 3) {
            vec[0] = position[i];
            vec[1] = position[i + 1];
            vec[2] = position[i + 2];
            vec3.transformMat4(vec, vec, matrix);
            position[i] = vec[0];
            position[i + 1] = vec[1];
            position[i + 2] = vec[2];
        }
    });
}

function unindexModelData(
    models: IFCModelData[],
    positionOut: Float32Array,
    submodels: Uint32Array
) {
    let outVertexIndex = 0;
    let outModelIndex = 0;

    models.forEach((model) => {
        const position = model.geometry.position;
        const expressID = model.geometry.expressID;
        const index = model.geometry.index;

        for (let i = 0; i < index.length; i++) {
            const indexValue = index[i] * 3;
            positionOut[outVertexIndex] = position[indexValue];
            positionOut[outVertexIndex + 1] = position[indexValue + 1];
            positionOut[outVertexIndex + 2] = position[indexValue + 2];
            outVertexIndex += 3;
            submodels[outModelIndex] = expressID[index[i]];
            outModelIndex++;
        }
    });
}
