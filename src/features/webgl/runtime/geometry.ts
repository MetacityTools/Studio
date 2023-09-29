import { Attribute } from './attribute';
import { ElementAttribute } from './elementAttribute';
import { InstancedAttribute } from './instancedAttribute';
import { Shader } from './shader';

export type Attributes = Map<string, Attribute | InstancedAttribute>;

export class Geometry {
    private vao?: WebGLVertexArrayObject;
    private attributes: Attributes = new Map();
    private isIndexed_ = false;
    private isInstanced_ = false;
    private needsRebind_ = false;
    private elements?: ElementAttribute;

    constructor(attrs: Attributes) {
        for (const [name, attribute] of attrs) {
            if (attribute instanceof InstancedAttribute) {
                this.isInstanced_ = true;
            }

            if (attribute instanceof ElementAttribute) {
                if (this.isIndexed_) throw new Error('Cannot have more than one index buffer');
                this.isIndexed_ = true;
                this.elements = attribute;
            }

            if (this.attributes.has(name)) throw new Error('Attribute already exists');
            this.attributes.set(name, attribute);
        }
    }

    private setup(gl: WebGL2RenderingContext, shader: Shader, rebind?: boolean) {
        const vao = gl.createVertexArray();
        if (!vao) throw new Error('Failed to create vertex array object');
        gl.bindVertexArray(vao);

        for (const [name, attribute] of this.attributes) {
            const location = shader.attributes[name];
            if (rebind) attribute.rebind(gl, location);
            else attribute.bind(gl, location);
        }

        gl.finish();
        this.vao = vao;
    }

    private rebind(gl: WebGL2RenderingContext, shader: Shader) {
        if (!this.vao) throw new Error('No vertex array object');
        gl.deleteVertexArray(this.vao);
        this.vao = undefined;
        this.setup(gl, shader, true);
        this.needsRebind_ = false;
        gl.finish();
    }

    get count() {
        if (!this.attributes.size) throw new Error('No attributes');
        const anyAttribtue = this.attributes.values().next().value;

        if (this.elements) {
            return this.elements.count;
        } else {
            return anyAttribtue.count / anyAttribtue.size;
        }
    }

    get instanceCount() {
        if (!this.attributes.size) throw new Error('No attributes');
        if (!this.isInstanced_) throw new Error('Not instanced');

        for (const attribute of this.attributes) {
            if (attribute instanceof InstancedAttribute) {
                return attribute.count / attribute.size;
            }
        }

        throw new Error('No instanced attributes');
    }

    get buffers() {
        return Array.from(this.attributes.values()).map((a) => a.buffer);
    }

    get isIndexed() {
        return this.isIndexed_;
    }

    get isInstanced() {
        return this.isInstanced_;
    }

    set needsRebind(value: boolean) {
        this.needsRebind_ = value;
    }

    getAttribute(name: string) {
        return this.attributes.get(name);
    }

    get rawAttributes() {
        return this.attributes;
    }

    get elementType() {
        if (!this.elements) throw new Error('No element buffer');
        if (this.elements.type === undefined) throw new Error('No element type');
        return this.elements.type;
    }

    bind(gl: WebGL2RenderingContext, shader: Shader) {
        if (this.needsRebind_) this.rebind(gl, shader);
        else if (!this.vao) this.setup(gl, shader);
        else gl.bindVertexArray(this.vao);
    }

    update(gl: WebGL2RenderingContext) {
        const attrs = this.attributes;
        for (const [name, attribute] of attrs) {
            if (attribute.buffer.needsUpdate && attribute.buffer.active)
                attribute.buffer.update(gl);
        }
    }

    dispose(gl?: WebGL2RenderingContext) {
        if (this.vao) {
            if (gl) gl.deleteVertexArray(this.vao);
            this.vao = undefined;
        }

        for (const [name, attribute] of this.attributes) {
            attribute.dispose(gl);
        }

        this.attributes.clear();

        if (this.elements) {
            this.elements.dispose(gl);
            this.elements = undefined;
        }
    }
}
