import { vec3 } from 'gl-matrix';
import { IFCLoaderData } from 'types';

self.onmessage = (e) => {
    console.log(e.data);
    computeIdealGrid(e.data);
};

function computeIdealGrid(model: IFCLoaderData) {
    unindexModel(model);
}

function unindexModel(model: IFCLoaderData) {
    applyMatricesToPositions(model);

    let count = countVertices(model);
    const vertices = new Float32Array(count * 3);

    unindexModelVertices(model, vertices);

    console.log(vertices);
}

function countVertices(model: IFCLoaderData) {
    let countVertices = 0;
    model.data.forEach((model) => {
        countVertices += model.geometry.position.length / 3;
    });
    return countVertices;
}

function applyMatricesToPositions(model: IFCLoaderData) {
    model.data.forEach((model) => {
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

function unindexModelVertices(model: IFCLoaderData, vertices: Float32Array) {
    let outBufferIndex = 0;
    model.data.forEach((model) => {
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
