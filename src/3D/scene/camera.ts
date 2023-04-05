import { mat4, quat, vec3 } from 'gl-matrix';

import { UniformValue } from '@3D/shaders/shader';

export enum ProjectionType {
    PERSPECTIVE,
    ORTHOGRAPHIC,
}

export interface CameraOptions {
    position?: vec3;
    target?: vec3;
    up?: vec3;
    projectionType?: ProjectionType;
    fovYRadian?: number;
    width?: number;
    height?: number;
    near?: number;
    far?: number;
}

export class Camera {
    position: vec3;
    target: vec3;
    up: vec3;
    type: ProjectionType;
    fovYRadian: number;
    aspectRatio: number;
    near: number;
    far: number;
    projectionMatrix: mat4 = mat4.create();
    viewMatrix: mat4 = mat4.create();
    projectionViewMatrix: mat4 = mat4.create();
    private direction: vec3 = vec3.create();
    private uniforms_: { [uniform: string]: UniformValue } = {};
    private width: number = 0;
    private height: number = 0;

    get uniforms() {
        return this.uniforms_;
    }

    constructor(options: CameraOptions = {}) {
        this.position = options.position ?? vec3.fromValues(50, 50, 50);
        this.target = options.target ?? vec3.fromValues(0, 0, 0);
        this.up = options.up ?? vec3.fromValues(0, 0, 1);
        this.type = options.projectionType ?? ProjectionType.PERSPECTIVE;
        this.fovYRadian = options.fovYRadian ?? Math.PI / 4;
        this.width = options.width ?? 1;
        this.height = options.height ?? 1;
        this.aspectRatio = this.width / this.height;
        this.near = options.near ?? 1;
        this.far = options.far ?? 1000;
        this.uniforms_['uCameraPosition'] = this.position;
        this.uniforms_['uCameraTarget'] = this.target;
        this.uniforms_['uCameraUp'] = this.up;
        this.uniforms_['uProjectionMatrix'] = this.projectionMatrix;
        this.uniforms_['uViewMatrix'] = this.viewMatrix;
        this.uniforms_['uProjectionViewMatrix'] = this.projectionViewMatrix;
        this.updateMatrices();
    }

    set(options: CameraOptions) {
        if (options.position) this.position = options.position;
        if (options.target) this.target = options.target;
        if (options.up) this.up = options.up;
        if (options.projectionType) this.projectionType = options.projectionType;
        if (options.fovYRadian) this.fovYRadian = options.fovYRadian;
        if (options.width) this.width = options.width;
        if (options.height) this.height = options.height;
        this.aspectRatio = this.width / this.height;
        if (options.near) this.near = options.near;
        if (options.far) this.far = options.far;
        this.updateMatrices();
    }

    private getFrustrumWidthAtTarget(): number {
        const distance = vec3.dist(this.position, this.target);
        return 2 * distance * Math.tan(this.fovYRadian / 2);
    }

    private getFrustumHeightAtTarget(): number {
        return this.getFrustrumWidthAtTarget() / this.aspectRatio;
    }

    private updatePositionForProjectionType(): void {
        const direction = this.direction;
        vec3.sub(direction, this.target, this.position);
        vec3.normalize(direction, direction);

        const distance = this.getFrustumHeightAtTarget() / (2 * Math.tan(this.fovYRadian / 2));

        if (this.projectionType === ProjectionType.PERSPECTIVE) {
            vec3.scale(direction, direction, distance);
            vec3.sub(this.position, this.target, direction);
        } else {
            vec3.scale(direction, direction, this.near + (this.far - this.near) / 2);
            vec3.sub(this.position, this.target, direction);
        }
    }

    get dir() {
        const direction = this.direction;
        vec3.sub(direction, this.position, this.target);
        vec3.normalize(direction, direction);
        return direction;
    }

    private updateViewMatrix() {
        mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
    }

    private updateProjectionMatrix() {
        if (this.projectionType === ProjectionType.PERSPECTIVE) {
            mat4.perspective(
                this.projectionMatrix,
                this.fovYRadian,
                this.aspectRatio,
                this.near,
                this.far
            );
        } else {
            const height = this.getFrustumHeightAtTarget();
            const width = height * this.aspectRatio;
            mat4.ortho(
                this.projectionMatrix,
                -width / 2,
                width / 2,
                -height / 2,
                height / 2,
                this.near,
                this.far
            );
        }
    }

    set projectionType(projectionType: ProjectionType) {
        this.type = projectionType;
        this.updatePositionForProjectionType();
        this.updateMatrices();
    }

    get projectionType(): ProjectionType {
        return this.type;
    }

    private updateMatrices() {
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

    updateProjectionViewMatrix() {
        mat4.multiply(this.projectionViewMatrix, this.projectionMatrix, this.viewMatrix);
    }

    updateAspectRatio(width: number, height: number) {
        this.aspectRatio = width / height;
        this.width = width;
        this.height = height;
        this.updateMatrices();
    }

    zoomOut() {
        const direction = this.dir;
        vec3.scale(direction, direction, 0.1);
        vec3.add(this.position, this.position, direction);
        this.updateMatrices();
    }

    zoomIn() {
        const direction = this.dir;
        vec3.scale(direction, direction, 0.1);
        vec3.sub(this.position, this.position, direction);
        this.updateMatrices();
    }

    scaleShiftToTargetPlane(shift: number, screenDimension: number) {
        const targetWidth = this.getFrustrumWidthAtTarget();
        const nearWidth = 2 * this.near * Math.tan(this.fovYRadian / 2);
        const scale = targetWidth / nearWidth;
        return (shift / screenDimension) * scale;
    }

    pan(x: number, y: number) {
        const right = vec3.create();
        const front = vec3.create();

        const direction = this.dir;
        vec3.cross(right, this.up, direction);
        vec3.cross(front, right, this.up);

        vec3.normalize(right, right);
        vec3.normalize(front, front);

        x = this.scaleShiftToTargetPlane(x, this.width);
        y = this.scaleShiftToTargetPlane(y, this.height);

        vec3.scale(right, right, -x);
        vec3.scale(front, front, -y);

        vec3.add(this.position, this.position, right);
        vec3.add(this.position, this.position, front);
        vec3.add(this.target, this.target, right);
        vec3.add(this.target, this.target, front);

        this.updateMatrices();
    }

    rotate(x: number, y: number) {
        console.log('rotate', x, y);

        const right = vec3.create();
        const front = vec3.create();

        const direction = this.dir;
        vec3.cross(right, this.up, direction);
        vec3.cross(front, right, this.up);

        vec3.normalize(right, right);
        vec3.normalize(front, front);

        const angleX = (x / this.width) * Math.PI;
        const angleY = (y / this.height) * Math.PI;

        //rotate using quaternion around target
        const q1 = quat.create();
        const q2 = quat.create();

        quat.setAxisAngle(q1, right, angleY);
        quat.setAxisAngle(q2, this.up, angleX);
        quat.multiply(q1, q1, q2);

        vec3.sub(this.position, this.position, this.target);
        vec3.transformQuat(this.position, this.position, q1);
        vec3.add(this.position, this.position, this.target);

        this.updateMatrices();
    }

    zoom(z: number) {
        const direction = this.dir;
        const fac = z > 0 ? 1 / 0.9 : 0.9;
        const dist = vec3.dist(this.position, this.target);
        vec3.scale(direction, direction, dist * fac);
        vec3.add(this.position, this.target, direction);
        this.updateMatrices();
    }
}
