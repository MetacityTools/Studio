import { vec2, vec3 } from 'gl-matrix';

import { Camera } from '@bananagl/camera/camera';
import { TypedArray } from '@bananagl/shaders/shader';

import { Ray } from './ray';

class Plane {
    private tmp: vec3 = vec3.create();
    constructor(private normal: vec3, private origin: vec3) {}
    static fromTwoRays(ray1: Ray, ray2: Ray) {
        const dist = vec3.distance(ray1.origin, ray2.origin);
        const crossDir = vec3.scaleAndAdd(vec3.create(), ray1.origin, ray1.direction, dist);
        vec3.normalize(crossDir, vec3.sub(crossDir, crossDir, ray2.origin));
        const normal = vec3.cross(vec3.create(), crossDir, ray2.direction);
        return new Plane(normal, ray1.origin);
    }

    sign(point: vec3) {
        return vec3.dot(this.normal, vec3.sub(this.tmp, point, this.origin));
    }
}

export class RectSelector {
    left: Plane;
    top: Plane;
    right: Plane;
    bottom: Plane;
    near: Plane;
    far: Plane;

    constructor(camera: Camera, from: vec2, to: vec2) {
        const xmin = Math.min(from[0], to[0]);
        const xmax = Math.max(from[0], to[0]);
        const ymin = Math.min(from[1], to[1]);
        const ymax = Math.max(from[1], to[1]);

        const bl = camera.primaryRay(xmin, ymin);
        const tl = camera.primaryRay(xmin, ymax);
        const br = camera.primaryRay(xmax, ymin);
        const tr = camera.primaryRay(xmax, ymax);
        const dir = vec3.create();
        vec3.normalize(dir, vec3.sub(dir, camera.target, camera.position));
        const negatedDir = vec3.negate(vec3.create(), dir);
        const farPoint = vec3.scaleAndAdd(vec3.create(), camera.position, dir, camera.far);
        const nearPoint = vec3.scaleAndAdd(vec3.create(), camera.position, dir, camera.near);

        this.left = Plane.fromTwoRays(bl, tl);
        this.top = Plane.fromTwoRays(tl, tr);
        this.right = Plane.fromTwoRays(tr, br);
        this.bottom = Plane.fromTwoRays(br, bl);
        this.far = new Plane(negatedDir, farPoint);
        this.near = new Plane(dir, nearPoint);
    }

    intersectBox(min: vec3, max: vec3) {
        if (this.left.sign(min) < 0 && this.left.sign(max) < 0) return false;
        if (this.top.sign(min) < 0 && this.top.sign(max) < 0) return false;
        if (this.right.sign(min) < 0 && this.right.sign(max) < 0) return false;
        if (this.bottom.sign(min) < 0 && this.bottom.sign(max) < 0) return false;
        if (this.far.sign(min) < 0 && this.far.sign(max) < 0) return false;
        if (this.near.sign(min) < 0 && this.near.sign(max) < 0) return false;
        return true;
    }

    triangleInside(data: TypedArray, triIndex: number) {
        const index = triIndex * 9;
        const a = vec3.fromValues(data[index], data[index + 1], data[index + 2]);
        const b = vec3.fromValues(data[index + 3], data[index + 4], data[index + 5]);
        const c = vec3.fromValues(data[index + 6], data[index + 7], data[index + 8]);

        if (this.left.sign(a) < 0 || this.left.sign(b) < 0 || this.left.sign(c) < 0) return false;
        if (this.top.sign(a) < 0 || this.top.sign(b) < 0 || this.top.sign(c) < 0) return false;
        if (this.right.sign(a) < 0 || this.right.sign(b) < 0 || this.right.sign(c) < 0)
            return false;
        if (this.bottom.sign(a) < 0 || this.bottom.sign(b) < 0 || this.bottom.sign(c) < 0)
            return false;
        if (this.far.sign(a) < 0 || this.far.sign(b) < 0 || this.far.sign(c) < 0) return false;
        if (this.near.sign(a) < 0 || this.near.sign(b) < 0 || this.near.sign(c) < 0) return false;

        return true;
    }
}
