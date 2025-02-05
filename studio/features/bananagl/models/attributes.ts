import { Shader } from "@bananagl/shaders/shader";

import { Attribute, ElementAttribute, InstancedAttribute } from "./attribute";

export class Attributes {
  private vao?: WebGLVertexArrayObject;
  private attributes: (Attribute | InstancedAttribute)[] = [];
  private isIndexed_ = false;
  private isInstanced_ = false;
  private needsRebind_ = false;
  private disposed_ = false;
  private elements?: ElementAttribute;

  constructor() {}

  add(attribute: Attribute) {
    if (attribute instanceof InstancedAttribute) {
      this.isInstanced_ = true;
    }

    if (attribute instanceof ElementAttribute) {
      if (this.isIndexed_)
        throw new Error("Cannot have more than one index buffer");
      this.isIndexed_ = true;
      this.elements = attribute;
    }

    this.attributes.push(attribute);
  }

  private setup(gl: WebGL2RenderingContext, shader: Shader, rebind?: boolean) {
    const vao = gl.createVertexArray();
    if (!vao) throw new Error("Failed to create vertex array object");
    gl.bindVertexArray(vao);

    for (const attribute of this.attributes) {
      const location = shader.attributes[attribute.name];
      if (rebind) attribute.rebind(gl, location);
      else attribute.bind(gl, location);
    }

    gl.finish();
    this.vao = vao;
  }

  private rebind(gl: WebGL2RenderingContext, shader: Shader) {
    if (this.vao) {
      gl.deleteVertexArray(this.vao);
      this.vao = undefined;
    }
    this.setup(gl, shader, true);
    this.needsRebind_ = false;
    gl.finish();
  }

  get count() {
    if (!this.attributes.length) throw new Error("No attributes");

    if (this.elements) {
      return this.elements.count;
    } else {
      return this.attributes[0].count / this.attributes[0].size;
    }
  }

  get instanceCount() {
    if (!this.attributes.length) throw new Error("No attributes");
    if (!this.isInstanced_) throw new Error("Not instanced");

    for (const attribute of this.attributes) {
      if (attribute instanceof InstancedAttribute) {
        return attribute.count / attribute.size;
      }
    }

    throw new Error("No instanced attributes");
  }

  get buffers() {
    return this.attributes.map((a) => a.buffer);
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
    return this.attributes.find((a) => a.name === name);
  }

  get rawAttributes() {
    return this.attributes;
  }

  get elementType() {
    if (!this.elements) throw new Error("No element buffer");
    if (this.elements.type === undefined) throw new Error("No element type");
    return this.elements.type;
  }

  bind(gl: WebGL2RenderingContext, shader: Shader) {
    if (this.disposed_) throw new Error("Cannot bind disposed attributes");
    if (this.needsRebind_) this.rebind(gl, shader);
    else if (!this.vao) this.setup(gl, shader);
    else gl.bindVertexArray(this.vao);
  }

  update(gl: WebGL2RenderingContext) {
    const attrs = this.attributes;
    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].buffer.needsUpdate && attrs[i].buffer.active)
        attrs[i].buffer.update(gl);
    }
  }

  dispose(gl: WebGL2RenderingContext) {
    if (this.vao) {
      gl.deleteVertexArray(this.vao);
      this.vao = undefined;
    }

    for (const attribute of this.attributes) {
      attribute.dispose(gl);
    }

    this.attributes.length = 0;

    if (this.elements) {
      this.elements.dispose(gl);
      this.elements = undefined;
    }

    this.disposed_ = true;
  }
}
