import { ModelMetadata } from 'types';

import { Selection } from '@bananagl/bananagl';
import * as GL from '@bananagl/bananagl';
import { OnPickCallback } from '@bananagl/models/pickable';

import { GeometryMode } from './GeometryMode';

export class EditorModel extends GL.Pickable implements GL.Selectable {
    protected data_: ModelMetadata = {
        name: 'Default Model Name',
        data: {},
    };

    private baseColor_ = [255, 255, 255];
    private selectedColor_ = [255, 180, 50];

    private highlitColor_ = [255, 245, 229];
    private white_ = [255, 255, 255];

    private file_: ArrayBuffer | null = null;

    constructor() {
        super();
    }

    set data(data: { [name: number]: any }) {
        for (const name in data) {
            const value = data[name];
            if (value === this.data_.data[name]) continue;
            this.data_.data[name] = value;
        }
    }

    set name(name: string) {
        this.data_.name = name;
    }

    get name() {
        return this.data_.name;
    }

    set file(file: ArrayBuffer | null) {
        this.file_ = file;
    }

    get data() {
        return this.data_.data;
    }

    get imported() {
        return true;
    }

    get file() {
        return this.file_;
    }

    private geometryMode_ = GeometryMode.SOLID;
    solidShader?: GL.Shader;
    wireframeShader?: GL.Shader;

    get geometryMode() {
        return this.geometryMode_;
    }

    set geometryMode(mode: GeometryMode) {
        this.geometryMode_ = mode;
        if (mode === GeometryMode.SOLID && this.solidShader) {
            this.shader = this.solidShader;
        } else if (mode === GeometryMode.WIREFRAME && this.wireframeShader) {
            this.shader = this.wireframeShader;
        }
    }

    onSelect(selection: Selection) {
        const id = selection.identifier;
        this.colorForId(
            id,
            this.selectedColor_[0],
            this.selectedColor_[1],
            this.selectedColor_[2],
            255
        );
    }

    onDeselect(selection: Selection) {
        const id = selection.identifier;
        this.colorForId(id, this.baseColor_[0], this.baseColor_[1], this.baseColor_[2], 0);
    }

    private colorForId(id: number, r: number, g: number, b: number, s: number = 1) {
        if (this.disposed) return;

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
            if (submodelBuffer[i] === id) {
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

    set selected(flag: boolean) {
        if (this.disposed) return;

        const color = flag ? this.highlitColor_ : this.white_;
        const baseColor = this.attributes.getAttribute('color');
        if (!baseColor) return;
        for (let i = 0; i < baseColor.buffer.data.length; i += 3) {
            if (baseColor.buffer.data[i + 2] === this.selectedColor_[2]) continue;
            baseColor.buffer.data[i] = color[0];
            baseColor.buffer.data[i + 1] = color[1];
            baseColor.buffer.data[i + 2] = color[2];
        }
        baseColor.buffer.toUpdate(0, baseColor.buffer.data.length);
        this.baseColor_ = color;
    }
}
