import { mat4 } from 'gl-matrix';
import { BufferAttribute, Mesh, MeshLambertMaterial } from 'three';

import { IFCModelData } from '@utils/types';

export function flattenModelTree(model: Mesh, parentMatrix: mat4 = mat4.create()): IFCModelData[] {
    const flat: IFCModelData[] = [swapFromYupToZup(toIFCModelData(model))];
    const m = flat[0].matrix;
    mat4.multiply(m, m, parentMatrix);
    model.children.forEach((child) => {
        flat.push(...flattenModelTree(child as Mesh, m));
    });
    return flat;
}

function swapFromYupToZup(model: IFCModelData) {
    const position = model.geometry.position;
    for (let i = 0; i < position.length; i += 3) {
        const y = position[i + 1];
        position[i + 1] = -position[i + 2];
        position[i + 2] = y;
    }

    return model;
}

function toIFCModelData(mesh: Mesh): IFCModelData {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    return {
        geometry: {
            expressID: (mesh.geometry.attributes.expressID as BufferAttribute).array as Uint32Array,
            position: (mesh.geometry.attributes.position as BufferAttribute).array as Float32Array,
            index: (mesh.geometry.index as BufferAttribute).array as Uint32Array,
        },
        materials: mats.map((material) => {
            return {
                color: (material as MeshLambertMaterial).color.toArray(),
                opacity: material.opacity,
            };
        }),
        matrix: mesh.matrix.toArray() as mat4,
    };
}
