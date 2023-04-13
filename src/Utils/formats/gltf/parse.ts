import { parse as parseGLTF } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
import { ModelGeometry, UserInputModel } from 'types';

export async function parse(model: UserInputModel): Promise<ModelGeometry> {
    const gltf = await parseGLTF(model.buffer, GLTFLoader, {
        worker: false,
    });
    const positions: number[] = [];

    for (let i = 0; i < gltf.meshes.length; i++) {
        const model = gltf.meshes[i];

        for (let j = 0; j < model.primitives.length; j++) {
            const attr = model.primitives[j].attributes.POSITION;
            const buffer = attr.value;
            const type = model.primitives[j].mode ?? 4;
            const indices = model.primitives[j].indices?.value ?? undefined;

            if (type === 4) {
                if (indices !== undefined) {
                    for (let k = 0; k < indices.length; k++) {
                        const index = indices[k] * 3;
                        positions.push(buffer[index], buffer[index + 1], buffer[index + 2]);
                    }
                } else {
                    for (let k = 0; k < buffer.length; k += 3) {
                        positions.push(buffer[k], buffer[k + 1], buffer[k + 2]);
                    }
                }
            }
        }
    }

    const posArr = new Float32Array(positions);
    swapFromYupToZup(posArr);
    return {
        position: posArr,
    };
}

function swapFromYupToZup(position: Float32Array) {
    for (let i = 0; i < position.length; i += 3) {
        const y = position[i + 1];
        position[i + 1] = -position[i + 2];
        position[i + 2] = y;
    }
}
