import { mat4, quat, vec2, vec3 } from 'gl-matrix';

import { Ray } from './ray';
import { UniformValue } from './shader';

export enum ProjectionType {
    PERSPECTIVE,
    ORTHOGRAPHIC,
}

export type CameraProps = {
    position?: vec3;
    target?: vec3;
    up?: vec3;
    right?: vec3;
    projectionType?: ProjectionType;
    fovYRadian?: number;
    width?: number;
    height?: number;
    near?: number;
    far?: number;
};

export class Camera {
    position: vec3;
    target: vec3;
    type: ProjectionType;
    fovYRadian: number;
    aspectRatio: number;
    near: number;
    far: number;

    readonly projectionMatrix: mat4 = mat4.create();
    readonly viewProjectionInverse: mat4 = mat4.create();
    readonly viewMatrix: mat4 = mat4.create();
    readonly projectionViewMatrix: mat4 = mat4.create();

    private upV: vec3;
    private rightV: vec3;
    private directionTMP: vec3 = vec3.create();
    private upTMP: vec3 = vec3.create();

    private uniforms_: { [uniform: string]: UniformValue } = {};

    private width: number = 0;
    private height: number = 0;
    private screenSize: vec2 = vec2.create();
    private maxangle: number = Math.PI / 2;
    private minangle: number = 0;

    private left: number = 0;
    private right: number = 0;
    private bottom: number = 0;
    private top: number = 0;

    get uniforms() {
        return this.uniforms_;
    }

    constructor(options: CameraProps = {}) {
        this.position = options.position ?? vec3.fromValues(0, 0, 10);
        this.target = options.target ?? vec3.fromValues(0, 0, 0);
        this.upV = options.up ?? vec3.fromValues(0, 0, 1);
        this.rightV = options.right ?? vec3.fromValues(1, 0, 0);
        this.type = options.projectionType ?? ProjectionType.PERSPECTIVE;
        this.fovYRadian = options.fovYRadian ?? Math.PI / 4;
        this.width = options.width ?? 1;
        this.height = options.height ?? 1;
        this.aspectRatio = this.width / this.height;
        this.near = options.near ?? 1;
        this.far = options.far ?? 100;

        this.uniforms_['uCameraPosition'] = this.position;
        this.uniforms_['uCameraTarget'] = this.target;
        this.uniforms_['uCameraUp'] = this.upV;
        this.uniforms_['uProjectionMatrix'] = this.projectionMatrix;
        this.uniforms_['uViewMatrix'] = this.viewMatrix;
        this.uniforms_['uProjectionViewMatrix'] = this.projectionViewMatrix;
        this.uniforms_['uScreenSize'] = this.screenSize;

        this.updateOrthoBounds();
        this.updateMatrices();
    }

    private updateOrthoBounds() {
        this.left = this.width / -2;
        this.right = this.width / 2;
        this.bottom = this.height / -2;
        this.top = this.height / 2;
    }

    set(options: CameraProps) {
        if (options.position) this.position = options.position;
        if (options.target) this.target = options.target;
        if (options.up) this.upV = options.up;
        if (options.right) this.rightV = options.right;
        if (options.projectionType) this.projectionType = options.projectionType;
        if (options.fovYRadian) this.fovYRadian = options.fovYRadian;
        if (options.width) this.width = options.width;
        if (options.height) this.height = options.height;
        this.aspectRatio = this.width / this.height;
        if (options.near) this.near = options.near;
        if (options.far) this.far = options.far;
        this.updateOrthoBounds();
        this.updateMatrices();
    }

    private getFrustrumWidthAtTarget(): number {
        if (this.projectionType === ProjectionType.ORTHOGRAPHIC) return this.right - this.left;
        const distance = vec3.dist(this.position, this.target);
        return 2 * distance * Math.tan(this.fovYRadian * 0.5);
    }

    private getFrustumHeightAtTarget(): number {
        if (this.projectionType === ProjectionType.ORTHOGRAPHIC) return this.top - this.bottom;
        return this.getFrustrumWidthAtTarget() / this.aspectRatio;
    }

    private swapPositionForProjection(newProjection: ProjectionType) {
        vec3.sub(this.directionTMP, this.target, this.position);
        vec3.normalize(this.directionTMP, this.directionTMP);

        if (newProjection === ProjectionType.PERSPECTIVE) {
            const width = this.getFrustrumWidthAtTarget();
            const distance = width / (2 * Math.tan(this.fovYRadian * 0.5));
            vec3.scale(this.directionTMP, this.directionTMP, distance);
            vec3.sub(this.position, this.target, this.directionTMP);
        } else {
            const width = this.getFrustrumWidthAtTarget();
            const height = width / this.aspectRatio;
            const initDistance = 5000;
            vec3.scale(this.directionTMP, this.directionTMP, initDistance);
            vec3.sub(this.position, this.target, this.directionTMP);

            this.left = -width / 2;
            this.right = width / 2;
            this.bottom = -height / 2;
            this.top = height / 2;
        }
    }

    //Returns normalized direction vector
    private get direction() {
        vec3.sub(this.directionTMP, this.target, this.position);
        vec3.normalize(this.directionTMP, this.directionTMP);
        return this.directionTMP;
    }

    //Returns normalized *approximate* up vector - the vector is either z-axis up or the cross product of the right and direction vector
    private get up() {
        const direction = this.direction;
        if (Math.abs(vec3.dot(direction, this.upV)) === 1) {
            return vec3.cross(this.upTMP, this.rightV, direction);
        }
        return this.upV;
    }

    //Returns *true* normalized up vector - the vector is the cross product of the right and direction vector
    private get trueUp() {
        return vec3.cross(this.upTMP, this.rightV, this.direction);
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
                this.left,
                this.right,
                this.bottom,
                this.top,
                this.near,
                this.far
            );
        }
    }

    set projectionType(projectionType: ProjectionType) {
        if (projectionType === this.projectionType) return;
        this.swapPositionForProjection(projectionType);
        this.type = projectionType;
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
        this.updateMatrices();
        mat4.multiply(this.projectionViewMatrix, this.viewMatrix, this.projectionMatrix);
        mat4.invert(this.viewProjectionInverse, this.projectionViewMatrix);
    }

    updateScreenSize(width: number, height: number) {
        this.aspectRatio = width / height;
        this.width = width;
        this.height = height;
        vec2.set(this.screenSize, width, height);
        this.updateOrthoBounds();
        this.updateProjectionViewMatrix();
    }

    private updateRightVector() {
        vec3.cross(this.rightV, this.direction, this.up);
        this.rightV[2] = 0;
        vec3.normalize(this.rightV, this.rightV);
    }

    get isOrthographic() {
        return this.projectionType === ProjectionType.ORTHOGRAPHIC;
    }

    private rightTMP = vec3.create();
    private frontTMP = vec3.create();

    pan(x: number, y: number) {
        const right = this.rightTMP;
        vec3.copy(right, this.rightV);
        const up = this.trueUp;

        //This is a bit risky, since the right does not always have to be in the horizontal plane
        const heightUnit = this.getFrustumHeightAtTarget() / this.height;
        const widthUnit = this.getFrustrumWidthAtTarget() / this.width;

        vec3.normalize(right, right);
        vec3.normalize(up, up);

        vec3.scale(right, right, -widthUnit * x);
        vec3.scale(up, up, heightUnit * y);

        vec3.add(this.position, this.position, right);
        vec3.add(this.position, this.position, up);
        vec3.add(this.target, this.target, right);
        vec3.add(this.target, this.target, up);

        this.updateRightVector();
        this.updateProjectionViewMatrix();
    }

    rotate(x: number, y: number) {
        const angleX = (x / this.width) * 2 * Math.PI;
        let angleY = -(y / this.height) * Math.PI;

        //rotate using quaternion around target
        const q1 = quat.create();
        const q2 = quat.create();

        const direction = this.direction;
        vec3.negate(direction, direction);
        const currentYAngle = Math.acos(vec3.dot(direction, this.upV));

        if (currentYAngle + angleY > this.maxangle) {
            angleY = this.maxangle - currentYAngle;
        } else if (currentYAngle + angleY < this.minangle) {
            angleY = this.minangle - currentYAngle;
        }

        quat.setAxisAngle(q1, this.rightV, angleY);
        quat.setAxisAngle(q2, this.upV, -angleX);
        quat.multiply(q1, q1, q2);

        vec3.sub(this.position, this.position, this.target);
        vec3.transformQuat(this.position, this.position, q1);
        vec3.transformQuat(this.rightV, this.rightV, q1);
        vec3.add(this.position, this.position, this.target);
        this.updateRightVector();

        this.updateProjectionViewMatrix();
    }

    zoom(delta: number, cursorPxX: number, cursorPxY: number) {
        const factor = delta > 0 ? 1.1 : 0.9;
        if (this.isOrthographic) {
            this.zoomOrthographic(factor, cursorPxX, cursorPxY);
        } else {
            this.zoomPerspective(factor, cursorPxX, cursorPxY);
        }
    }

    displacement = vec3.create();
    aPosTMP = vec3.create();
    bPosTMP = vec3.create();

    private zoomOrthographic(factor: number, cursorPerctX: number, cursorPerctY: number) {
        const dir = this.direction;
        const right = this.rightV;
        const pos = this.position;
        const up = this.trueUp;
        cursorPerctY = 1 - cursorPerctY; //Flip y axis since webgl has origin in bottom left corner

        //Convert cursor position from screen space to world space at the near plane
        const width = this.right - this.left;
        const height = this.top - this.bottom;

        const cursorWorldOffsetX = width * cursorPerctX - width * 0.5; // Offset from center of view.
        const cursorWorldOffsetY = height * cursorPerctY - height * 0.5; // Offset from center of view.

        const nearPos = vec3.set(
            this.aPosTMP,
            pos[0] + cursorWorldOffsetX * right[0] + cursorWorldOffsetY * up[0],
            pos[1] + cursorWorldOffsetX * right[1] + cursorWorldOffsetY * up[1],
            pos[2] + cursorWorldOffsetX * right[2] + cursorWorldOffsetY * up[2]
        );

        vec3.scaleAndAdd(nearPos, nearPos, dir, this.near);

        //Zoom the camera
        this.left = this.left * factor;
        this.right = this.right * factor;
        this.top = this.top * factor;
        this.bottom = this.bottom * factor;

        //Find the world space position of the cursor after zoom at the near plane
        const newWidth = this.right - this.left;
        const newHeight = this.top - this.bottom;

        const newCursorWorldOffsetX = newWidth * cursorPerctX - newWidth * 0.5;
        const newCursorWorldOffsetY = newHeight * cursorPerctY - newHeight * 0.5;

        const newNearPos = vec3.set(
            this.bPosTMP,
            pos[0] + newCursorWorldOffsetX * right[0] + newCursorWorldOffsetY * up[0],
            pos[1] + newCursorWorldOffsetX * right[1] + newCursorWorldOffsetY * up[1],
            pos[2] + newCursorWorldOffsetX * right[2] + newCursorWorldOffsetY * up[2]
        );

        vec3.scaleAndAdd(newNearPos, newNearPos, dir, this.near);

        //Calculate the displacement and adjust the camera's position
        const displacement = vec3.sub(this.displacement, newNearPos, nearPos);
        vec3.sub(this.position, this.position, displacement);
        vec3.sub(this.target, this.target, displacement);

        this.updateProjectionViewMatrix();
    }

    private zoomPerspective(factor: number, cursorPerctX: number, cursorPerctY: number) {
        const offset = this.direction;
        const right = this.rightV;
        const pos = this.position;
        const tar = this.target;
        const up = this.trueUp;
        cursorPerctY = 1 - cursorPerctY; //Flip y axis since webgl has origin in bottom left corner

        //Get the world space position of the cursor on the target plane
        let targetPlaneW = this.getFrustrumWidthAtTarget();
        let targetPlaneH = targetPlaneW / this.aspectRatio;
        let cursorTargetPlaneOffsetX = targetPlaneW * cursorPerctX - targetPlaneW * 0.5;
        let cursorTargetPlaneOffsetY = targetPlaneH * cursorPerctY - targetPlaneH * 0.5;

        const tarPos = vec3.set(
            this.aPosTMP,
            tar[0] + cursorTargetPlaneOffsetX * right[0] + cursorTargetPlaneOffsetY * up[0],
            tar[1] + cursorTargetPlaneOffsetX * right[1] + cursorTargetPlaneOffsetY * up[1],
            tar[2] + cursorTargetPlaneOffsetX * right[2] + cursorTargetPlaneOffsetY * up[2]
        );

        //Zoom
        vec3.sub(offset, pos, this.target);
        vec3.scale(offset, offset, factor);
        vec3.add(pos, this.target, offset);

        //Get the world space position of the cursor on the near plane after the zoom
        targetPlaneW = this.getFrustrumWidthAtTarget();
        targetPlaneH = targetPlaneW / this.aspectRatio;
        cursorTargetPlaneOffsetX = targetPlaneW * cursorPerctX - targetPlaneW * 0.5;
        cursorTargetPlaneOffsetY = targetPlaneH * cursorPerctY - targetPlaneH * 0.5;

        const newTarPos = vec3.set(
            this.bPosTMP,
            tar[0] + cursorTargetPlaneOffsetX * right[0] + cursorTargetPlaneOffsetY * up[0],
            tar[1] + cursorTargetPlaneOffsetX * right[1] + cursorTargetPlaneOffsetY * up[1],
            tar[2] + cursorTargetPlaneOffsetX * right[2] + cursorTargetPlaneOffsetY * up[2]
        );

        //Calculate the displacement and adjust the camera's position
        const displacement = vec3.sub(this.displacement, newTarPos, tarPos);
        vec3.sub(this.position, this.position, displacement);
        vec3.sub(this.target, this.target, displacement);
        this.updateProjectionViewMatrix();
    }

    topView() {
        const distance = vec3.distance(this.position, this.target);
        vec3.set(this.position, this.target[0], this.target[1], this.target[2] + distance);
        vec3.set(this.rightV, 1, 0, 0);
        this.updateProjectionViewMatrix();
    }

    frontView() {
        const distance = vec3.distance(this.position, this.target);
        vec3.set(this.position, this.target[0], this.target[1] - distance, this.target[2]);
        this.updateRightVector();
        this.updateProjectionViewMatrix();
    }

    rightView() {
        const distance = vec3.distance(this.position, this.target);
        vec3.set(this.position, this.target[0] + distance, this.target[1], this.target[2]);
        this.updateRightVector();
        this.updateProjectionViewMatrix();
    }

    leftView() {
        const distance = vec3.distance(this.position, this.target);
        vec3.set(this.position, this.target[0] - distance, this.target[1], this.target[2]);
        this.updateRightVector();
        this.updateProjectionViewMatrix();
    }

    backView() {
        const distance = vec3.distance(this.position, this.target);
        vec3.set(this.position, this.target[0], this.target[1] + distance, this.target[2]);
        this.updateRightVector();
        this.updateProjectionViewMatrix();
    }

    get z() {
        return this.target[2];
    }

    set z(z: number) {
        const delta = z - this.target[2];
        this.target[2] += delta;
        this.position[2] += delta;
        this.updateProjectionViewMatrix();
    }

    primaryRay(ndcX: number, ndcY: number) {
        if (this.isOrthographic) {
            return this.primaryRayOrthographic(ndcX, ndcY);
        }
        return this.primaryRayPerspective(ndcX, ndcY);
    }

    private primaryRayOrthographic(ndcX: number, ndcY: number) {
        const origin = vec3.create();
        // Normalize camera direction
        const direction = this.direction;
        const frustumWidth = this.right - this.left;
        const frustumHeight = this.top - this.bottom;

        // Compute the right and up vectors for the camera
        const right = this.rightV;
        const up = vec3.create();
        vec3.cross(up, right, direction);
        vec3.normalize(up, up);

        // Compute the world space coordinates of the pixel
        const unitWorldX = ndcX * frustumWidth * 0.5;
        const unitWorldY = ndcY * frustumHeight * 0.5;

        // Compute the primary ray's origin
        vec3.scaleAndAdd(origin, this.position, right, unitWorldX);
        vec3.scaleAndAdd(origin, origin, up, unitWorldY);

        const ray = new Ray();
        vec3.copy(ray.origin, origin);
        vec3.copy(ray.direction, direction);

        return ray;
    }

    private primaryRayPerspective(ndcX: number, ndcY: number) {
        // Normalize camera direction
        const direction = vec3.create();
        vec3.copy(direction, this.direction);

        // Compute the right and up vectors for the camera
        const up = vec3.create();
        const right = this.rightV;
        vec3.cross(up, right, direction);
        vec3.normalize(up, up);

        // Compute the half width and half height of the near plane
        const halfHeight = Math.tan(this.fovYRadian / 2);
        const halfWidth = halfHeight * this.aspectRatio;

        // Compute the world space coordinates of the pixel
        const unitWorldX = ndcX * halfWidth;
        const unitWorldY = ndcY * halfHeight;

        // Compute the primary ray's direction
        vec3.scaleAndAdd(direction, direction, right, unitWorldX);
        vec3.scaleAndAdd(direction, direction, up, unitWorldY);
        vec3.normalize(direction, direction);

        const ray = new Ray();
        vec3.copy(ray.origin, this.position);
        vec3.copy(ray.direction, direction);
        return ray;
    }

    cameraPlaneVector(dx: number, dy: number) {
        const currentUp = vec3.create();
        vec3.cross(currentUp, this.rightV, this.direction);
        vec3.normalize(currentUp, currentUp);

        const currentRight = vec3.create();
        vec3.cross(currentRight, this.direction, currentUp);
        vec3.normalize(currentRight, currentRight);

        const heightUnit = this.getFrustumHeightAtTarget() / this.height;
        const widthUnit = this.getFrustrumWidthAtTarget() / this.width;

        vec3.scale(currentRight, currentRight, widthUnit * dx);
        vec3.scale(currentUp, currentUp, -heightUnit * dy);

        const dir = vec3.create();
        vec3.add(dir, currentRight, currentUp);
        return dir;
    }
}
