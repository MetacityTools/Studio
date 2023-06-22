import { vec3 } from 'gl-matrix';

import { linearInterpolateColor } from '@utils/modifiers/color';
import { GeometryMode, PrimitiveType } from '@utils/types';

import * as GL from '@bananagl/bananagl';

export class EditorModel extends GL.Pickable implements GL.Selectable {
    public name = 'Default Model Name';
    public primitive: PrimitiveType = PrimitiveType.UNDEFINED;

    private bbox?: GL.BBox;

    private geometryMode_ = GeometryMode.SOLID;
    public solidShader?: GL.Shader;
    public wireframeShader?: GL.Shader;
    public noEdgesShader?: GL.Shader;

    constructor() {
        super();
    }

    get submodelIDs() {
        const attr = this.attributes.getAttribute('submodel');
        if (!attr) throw new Error('No submodel attribute found');
        const submodel = attr.buffer.getView(Uint32Array) as Uint32Array;
        return new Set(submodel);
    }

    get geometryMode() {
        return this.geometryMode_;
    }

    set geometryMode(mode: GeometryMode) {
        this.geometryMode_ = mode;
        if (mode === GeometryMode.SOLID && this.solidShader) {
            this.shader = this.solidShader;
        } else if (mode === GeometryMode.WIREFRAME && this.wireframeShader) {
            this.shader = this.wireframeShader;
        } else if (mode === GeometryMode.NOEDGES && this.noEdgesShader) {
            this.shader = this.noEdgesShader;
        }
    }

    get boundingBox() {
        if (!this.bbox) {
            const pos = this.attributes.getAttribute('position');
            this.bbox = new GL.BBox();
            if (pos) this.bbox.extendArr(pos.buffer.data, 0, pos.buffer.data.length);
        }
        return this.bbox;
    }

    select(submodelIDs: Set<number>) {
        this.selectSubmodels(submodelIDs, 255);
    }

    deselect(submodelIDs: Set<number>) {
        this.selectSubmodels(submodelIDs, 0);
    }

    setColorMap(factors: Map<number, number>, colorMap: vec3[]) {
        if (this.disposed) return;
        if (factors.size === 0) return;

        const color = this.attributes.getAttribute('color');
        const submodel = this.attributes.getAttribute('submodel');
        const submodelBuffer = submodel!.buffer.getView(Uint32Array);

        if (!submodel) return;
        if (!color) return;

        let factor;
        for (let i = 0; i < submodelBuffer.length; i++) {
            factor = factors.get(submodelBuffer[i])!;
            if (factor !== undefined) {
                const c = linearInterpolateColor(colorMap, factor);
                const scidx = i * 3;
                color.buffer.data[scidx] = c[0] * 155 + 100;
                color.buffer.data[scidx + 1] = c[1] * 155 + 100;
                color.buffer.data[scidx + 2] = c[2] * 155 + 100;
            }
        }

        color.buffer.toUpdate();
    }

    whiten() {
        if (this.disposed) return;
        const color = this.attributes.getAttribute('color');

        if (!color) return;

        for (let i = 0; i < color.buffer.data.length; i++) {
            color.buffer.data[i] = 255;
        }

        color.buffer.toUpdate();
    }

    private selectSubmodels(submodelIDs: Set<number>, s: number) {
        if (this.disposed) return;
        if (submodelIDs.size === 0) return;
        const selected = this.attributes.getAttribute('selected');
        const submodel = this.attributes.getAttribute('submodel');
        const submodelBuffer = submodel!.buffer.getView(Uint32Array);

        if (!submodel) return;
        if (!selected) return;

        for (let i = 0; i < submodelBuffer.length; i++) {
            if (submodelIDs.has(submodelBuffer[i])) selected.buffer.data[i] = s;
        }

        selected.buffer.toUpdate();
    }

    deselectAll() {
        if (this.disposed) return;
        const selected = this.attributes.getAttribute('selected');
        if (!selected) return;
        for (let i = 0; i < selected.buffer.data.length; i++) selected.buffer.data[i] = 0;
        selected.buffer.toUpdate();
    }
}

export const DEFAULT_UNIFORMS = {
    uZMin: 0,
    uZMax: 10,
};
