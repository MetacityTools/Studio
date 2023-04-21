import { ModelMetadata } from 'types';

import { Selection } from '@bananagl/bananagl';
import * as GL from '@bananagl/bananagl';

import { GeometryMode } from './geometry';

export class EditorModel extends GL.Pickable implements GL.Selectable {
    protected data_: ModelMetadata = {
        name: 'Default Model Name',
        data: {},
    };

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

    get data() {
        return this.data_.data;
    }

    get imported() {
        return true;
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
        this.colorForId(id, 255, 180, 50, 255);
    }

    onDeselect(selection: Selection) {
        const id = selection.identifier;
        this.colorForId(id, 255, 255, 255, 0);
    }

    private colorForId(id: number, r: number, g: number, b: number, s: number = 1) {
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
}
