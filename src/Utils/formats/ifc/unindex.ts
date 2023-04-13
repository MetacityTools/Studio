import { vec3 } from 'gl-matrix';
import { IFCModelData } from 'types';

export function unindexModel(model: IFCModelData[]) {
    applyMatricesToPositions(model);
    let count = countVertices(model);
    const vertices = new Float32Array(count * 3);
    unindexModelVertices(model, vertices);
    return vertices;
}

function countVertices(models: IFCModelData[]) {
    let countVertices = 0;
    models.forEach((model) => {
        countVertices += model.geometry.position.length / 3;
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

function unindexModelVertices(models: IFCModelData[], vertices: Float32Array) {
    let outBufferIndex = 0;
    models.forEach((model) => {
        const position = model.geometry.position;
        const index = model.geometry.index;

        for (let i = 0; i < index.length; i++) {
            const indexValue = index[i] * 3;
            vertices[outBufferIndex] = position[indexValue];
            vertices[outBufferIndex + 1] = position[indexValue + 1];
            vertices[outBufferIndex + 2] = position[indexValue + 2];
            outBufferIndex += 3;
        }
    });
}
