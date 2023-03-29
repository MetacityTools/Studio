import { Shader } from '@3D/shaders/shader';

type BufferData =
    | Float32Array
    | Uint16Array
    | Uint32Array
    | Uint8Array
    | Int16Array
    | Int32Array
    | Int8Array;

export class Buffer {
    buffer: WebGLBuffer | null = null;
    constructor(public data: BufferData) {}

    private setup(gl: WebGL2RenderingContext) {
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Failed to create buffer');
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
        this.buffer = buffer;
    }

    bind(gl: WebGL2RenderingContext): asserts this is { buffer: WebGLBuffer } {
        if (!this.buffer) this.setup(gl);
        else gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }

    getDataType(gl: WebGL2RenderingContext) {
        if (this.data instanceof Float32Array) return gl.FLOAT;
        else if (this.data instanceof Uint16Array) return gl.UNSIGNED_SHORT;
        else if (this.data instanceof Uint32Array) return gl.UNSIGNED_INT;
        else if (this.data instanceof Uint8Array) return gl.UNSIGNED_BYTE;
        else if (this.data instanceof Int16Array) return gl.SHORT;
        else if (this.data instanceof Int32Array) return gl.INT;
        else if (this.data instanceof Int8Array) return gl.BYTE;
        else throw new Error('Unknown data type');
    }

    get BYTES_PER_ELEMENT() {
        return this.data.BYTES_PER_ELEMENT;
    }

    get bytesAllocated() {
        return this.data.length * this.data.BYTES_PER_ELEMENT;
    }
}

export class Attribute {
    protected active = false;
    public type?: number;

    constructor(
        public name: string,
        public buffer: Buffer,
        public size: number,
        public normalized: boolean = false,
        public stride: number = 0,
        public offset: number = 0
    ) {}

    protected setup(gl: WebGL2RenderingContext, location: number) {
        this.buffer.bind(gl);
        this.type = this.buffer.getDataType(gl);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(
            location,
            this.size,
            this.type,
            this.normalized,
            this.stride * this.buffer.BYTES_PER_ELEMENT,
            this.offset * this.buffer.BYTES_PER_ELEMENT
        );
        this.active = true;
    }

    get count() {
        return this.buffer.data.length / this.size;
    }

    bind(gl: WebGL2RenderingContext, location: number) {
        if (!this.active) this.setup(gl, location);
        else this.buffer.bind(gl);
    }
}

export class InstancedAttribute extends Attribute {
    private divisor: number;

    constructor(
        name: string,
        buffer: Buffer,
        size: number,
        normalized: boolean,
        stride: number,
        offset: number,
        divisor: number
    ) {
        super(name, buffer, size, normalized, stride, offset);
        this.divisor = divisor;
    }

    protected setup(gl: WebGL2RenderingContext, location: number) {
        super.setup(gl, location);
        gl.vertexAttribDivisor(location, this.divisor);
    }

    bind(gl: WebGL2RenderingContext, location: number) {
        if (!this.active) this.setup(gl, location);
        super.bind(gl, location);
    }
}

export class Attributes {
    private vao?: WebGLVertexArrayObject;
    private attributes: (Attribute | InstancedAttribute)[] = [];

    constructor() {}

    add(attribute: Attribute | InstancedAttribute) {
        this.attributes.push(attribute);
    }

    private setup(gl: WebGL2RenderingContext, shader: Shader) {
        const vao = gl.createVertexArray();
        if (!vao) throw new Error('Failed to create vertex array object');
        gl.bindVertexArray(vao);

        for (const attribute of this.attributes) {
            const location = shader.attributes[attribute.name];
            if (location === undefined || location === -1) continue;
            attribute.bind(gl, location);
        }

        gl.bindVertexArray(null);
        this.vao = vao;
    }

    get count() {
        return this.attributes[0].count;
    }

    get buffers() {
        return this.attributes.map((a) => a.buffer);
    }

    bind(gl: WebGL2RenderingContext, shader: Shader) {
        if (!this.vao) this.setup(gl, shader);
        else gl.bindVertexArray(this.vao);
    }
}
