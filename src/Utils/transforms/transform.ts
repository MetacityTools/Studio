import { vec3 } from 'gl-matrix';

import { EditorModel } from '@utils/models/EditorModel';
import { addPointcloudModel } from '@utils/models/addPointcloudModel';

import * as GL from '@bananagl/bananagl';

const GRID_UNIT = 1;

export function transform(scene: GL.Scene) {
    //filter out only user models
    const userModels = scene.objects.filter((obj) => obj instanceof EditorModel) as EditorModel[];
    //compute ideal grid
    const { min, max } = computeGrid(userModels);
    const samplePoints = computeSamplePoints(min, max);
    const colors = shootRaysUp(scene, samplePoints);
    const model = addPointcloudModel(samplePoints, colors, scene);
}

function computeGrid(models: EditorModel[]) {
    const positions = models.map(
        (model) => model.attributes.getAttribute('position') as GL.Attribute
    );
    const min = vec3.create();
    const max = vec3.create();
    positions.forEach((position) => {
        const buffer = position.buffer.getView(Float32Array) as Float32Array;
        for (let i = 0; i < buffer.length; i += 3) {
            vec3.min(min, min, buffer.subarray(i, i + 3));
            vec3.max(max, max, buffer.subarray(i, i + 3));
        }
    });

    return { min, max };
}

function computeSamplePoints(min: vec3, max: vec3) {
    const dims = vec3.create();
    vec3.sub(dims, max, min);
    const resolution = vec3.create();
    vec3.div(resolution, dims, [GRID_UNIT, GRID_UNIT, GRID_UNIT]);
    vec3.ceil(resolution, resolution);
    vec3.add(resolution, resolution, [1, 1, 1]);
    const samplePoints = new Float32Array(resolution[0] * resolution[1] * resolution[2] * 3);
    let idx = 0;
    for (let i = 0; i < resolution[0]; i++) {
        for (let j = 0; j < resolution[1]; j++) {
            for (let k = 0; k < resolution[2]; k++) {
                samplePoints[idx++] = min[0] + i * GRID_UNIT;
                samplePoints[idx++] = min[1] + j * GRID_UNIT;
                samplePoints[idx++] = min[2] + k * GRID_UNIT;
            }
        }
    }

    return samplePoints;
}

function shootRaysUp(scene: GL.Scene, samplePoints: Float32Array) {
    const results = new Uint8Array(samplePoints.length / 3).fill(255);
    const ray = new GL.Ray();

    let start = performance.now(),
        now = performance.now();
    for (let i = 0; i < samplePoints.length; i += 3) {
        ray.origin = samplePoints.subarray(i, i + 3);
        ray.direction = [0, 0, 1];
        const hit = scene.picker.trace(ray);
        if (hit) {
            results[i / 3] = 0;
        }

        if (i % 10000 === 0) {
            console.log(`Took ${performance.now() - start}ms for ${i} rays`);
            now = performance.now();
        }
    }

    console.log(`Took ${performance.now() - start}ms`);
    return results;
}
