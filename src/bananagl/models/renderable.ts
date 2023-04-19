import { mat4 } from 'gl-matrix';

import { BVH } from '@bananagl/scene/bvh';
import { Shader, UniformValue } from '@bananagl/shaders/shader';

import { Attributes } from './attributes';

export abstract class Renderable {
    private bvh_?: BVH;

    private uniforms_: { [name: string]: UniformValue } = {
        uModelMatrix: mat4.identity(mat4.create()),
    };
    private attributes_: Attributes = new Attributes();

    set uniforms(values: { [name: string]: UniformValue }) {
        for (const name in values) {
            const value = values[name];
            if (value === this.uniforms_[name]) continue;
            this.uniforms_[name] = value;
        }
    }

    get uniforms() {
        return this.uniforms_;
    }

    get attributes() {
        return this.attributes_;
    }

    get transform(): mat4 {
        return this.uniforms_.uModelMatrix as mat4;
    }

    set BVH(bvh: BVH | undefined) {
        this.bvh_ = bvh;
    }

    get BVH() {
        return this.bvh_;
    }

    abstract get shader(): Shader;
}
