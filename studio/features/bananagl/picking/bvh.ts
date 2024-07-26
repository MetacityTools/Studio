import { mat4, vec2, vec3 } from 'gl-matrix';

import { BBox } from './bbox';
import { Ray } from './ray';
import { RectSelector } from './rect';

export interface BVH {
    trace(ray: Ray): { t: number; index: number };
    pointsInDistance(point: vec3, dist: number): number[];
    traceRect(rect: RectSelector): number[];
    traceArea(from: vec2, to: vec2): number[];
    rebuild(): Promise<void>;
}

export interface BVHNode {
    bbox: BBox;
    left?: BVHNode;
    right?: BVHNode;
    from?: number;
    to?: number;
}
