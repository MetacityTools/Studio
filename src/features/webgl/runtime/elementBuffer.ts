import { Buffer } from './buffer';

export class ElementBuffer extends Buffer {
    buffer: WebGLBuffer | null = null;
    constructor(public data: Uint16Array | Uint32Array) {
        super(data);
    }

    protected setup(gl: WebGL2RenderingContext) {
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Failed to create buffer');
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
        this.buffer = buffer;
    }

    bind(gl: WebGL2RenderingContext): asserts this is { buffer: WebGLBuffer } {
        if (!this.buffer) this.setup(gl);
        else gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    get BYTES_PER_ELEMENT() {
        return this.data.BYTES_PER_ELEMENT;
    }

    get bytesAllocated() {
        return this.data.length * this.data.BYTES_PER_ELEMENT;
    }
}
