import { mat4 } from 'gl-matrix';

import { Renderable } from '@bananagl/bananagl';

import { BVH } from './bvh';
import { Ray } from './ray';

const inverseTransform = mat4.create();

export type OnPickCallback = (object: Renderable, primitiveIndex: number, t: number) => void;

export class BVHContainer {
    private objects: Renderable[] = [];
    private callbacks: OnPickCallback[] = [];

    add(renderable: Renderable) {
        if (!renderable.BVH) return;
        this.objects.push(renderable);
    }

    trace(ray: Ray) {
        let bestT = Infinity,
            bestObjectIndex = -1,
            bestPrimitiveIndex = -1;
        for (let objectIndex = 0; objectIndex < this.objects.length; objectIndex++) {
            const object = this.objects[objectIndex];
            const bvh = object.BVH as BVH;

            ray.transform(mat4.invert(inverseTransform, object.transform));

            const hit = bvh.trace(ray);
            if (hit.t < bestT) {
                bestT = hit.t;
                bestObjectIndex = objectIndex;
                bestPrimitiveIndex = hit.index;
            }
            ray.untransform();
        }

        if (bestObjectIndex === -1) return null;

        console.log('Picked object', this.objects[bestObjectIndex], 'at', bestT);

        this.callbacks.forEach((callback) =>
            callback(this.objects[bestObjectIndex], bestPrimitiveIndex, bestT)
        );
    }

    set onPick(callback: OnPickCallback) {
        this.callbacks.push(callback);
    }
}
