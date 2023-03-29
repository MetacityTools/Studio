import { mat4, vec3 } from 'gl-matrix';

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
    aspectRatio?: number;
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

    get uniforms() {
        return this.uniforms_;
    }

    constructor(options: CameraOptions = {}) {
        this.position = options.position ?? vec3.fromValues(50, 50, 50);
        this.target = options.target ?? vec3.fromValues(0, 0, 0);
        this.up = options.up ?? vec3.fromValues(0, 0, 1);
        this.type = options.projectionType ?? ProjectionType.PERSPECTIVE;
        this.fovYRadian = options.fovYRadian ?? Math.PI / 4;
        this.aspectRatio = options.aspectRatio ?? 1;
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
        if (options.aspectRatio) this.aspectRatio = options.aspectRatio;
        if (options.near) this.near = options.near;
        if (options.far) this.far = options.far;
        this.updateMatrices();
    }

    private getFrustumHeightAtTarget(): number {
        const distance = vec3.dist(this.position, this.target);
        return 2 * distance * Math.tan(this.fovYRadian / 2);
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

    updateAspectRatio(aspectRatio: number) {
        this.aspectRatio = aspectRatio;
        this.updateMatrices();
    }

    zoomOut() {
        const direction = this.direction;
        vec3.sub(direction, this.position, this.target);
        vec3.normalize(direction, direction);
        vec3.scale(direction, direction, 0.1);
        vec3.add(this.position, this.position, direction);
        this.updateMatrices();
    }

    zoomIn() {
        const direction = this.direction;
        vec3.sub(direction, this.position, this.target);
        vec3.normalize(direction, direction);
        vec3.scale(direction, direction, 0.1);
        vec3.sub(this.position, this.position, direction);
        this.updateMatrices();
    }
}
