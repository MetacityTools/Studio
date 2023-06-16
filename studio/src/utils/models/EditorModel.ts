import { GeometryMode, PrimitiveType } from '@utils/types';

import * as GL from '@bananagl/bananagl';

export class EditorModel extends GL.Pickable implements GL.Selectable {
    public name = 'Default Model Name';
    public primitive: PrimitiveType = PrimitiveType.UNDEFINED;

    private baseColor_ = [255, 255, 255];
    private selectedColor_ = [255, 180, 50];

    private highlitColor_ = [255, 245, 229];
    private white_ = [255, 255, 255];

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

    select(submodelIDs: Set<number>) {
        this.colorForId(
            submodelIDs,
            this.selectedColor_[0],
            this.selectedColor_[1],
            this.selectedColor_[2],
            255
        );
    }

    deselect(submodelIDs: Set<number>) {
        this.colorForId(submodelIDs, this.baseColor_[0], this.baseColor_[1], this.baseColor_[2], 0);
    }

    get boundingBox() {
        if (!this.bbox) {
            const pos = this.attributes.getAttribute('position');
            this.bbox = new GL.BBox();
            if (pos) this.bbox.extendArr(pos.buffer.data, 0, pos.buffer.data.length);
        }
        return this.bbox;
    }

    private colorForId(submodelIDs: Set<number>, r: number, g: number, b: number, s: number = 1) {
        if (this.disposed) return;
        if (submodelIDs.size === 0) return;
        const color = this.attributes.getAttribute('color');
        const selected = this.attributes.getAttribute('selected');
        const submodel = this.attributes.getAttribute('submodel');
        const submodelBuffer = submodel!.buffer.getView(Uint32Array);

        if (!submodel) return;
        if (!color) return;
        if (!selected) return;

        let updateStart = 0,
            updateEnd = 0;
        for (let i = 0; i < submodelBuffer.length; i++) {
            if (submodelIDs.has(submodelBuffer[i])) {
                const scidx = i * 3;
                color.buffer.data[scidx] = r;
                color.buffer.data[scidx + 1] = g;
                color.buffer.data[scidx + 2] = b;
                selected.buffer.data[i] = s;

                if (updateStart === undefined) {
                    updateStart = scidx;
                    updateEnd = scidx + 3;
                } else if (updateEnd === scidx) {
                    updateEnd = scidx + 3;
                } else {
                    color.buffer.toUpdate(updateStart, updateEnd);
                    selected.buffer.toUpdate(updateStart / 3, updateEnd / 3);
                    updateStart = scidx;
                    updateEnd = scidx + 3;
                }
            }
        }

        color.buffer.toUpdate(updateStart, updateEnd);
        selected.buffer.toUpdate(updateStart / 3, updateEnd / 3);
    }

    set selected(isSelected: boolean) {
        if (this.disposed) return;

        const color = isSelected ? this.highlitColor_ : this.white_;
        const baseColor = this.attributes.getAttribute('color');
        if (!baseColor) return;

        for (let i = 0; i < baseColor.buffer.data.length; i += 3) {
            baseColor.buffer.data[i] = color[0];
            baseColor.buffer.data[i + 1] = color[1];
            baseColor.buffer.data[i + 2] = color[2];
        }

        baseColor.buffer.toUpdate();
        this.baseColor_ = color;
    }
}

export const DEFAULT_UNIFORMS = {
    uZMin: 0,
    uZMax: 10,
};
