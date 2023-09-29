import { mat2, mat3, mat4 } from 'gl-matrix';

import { Buffer, TypedArray, cloneTypedArrayWithSize } from './buffer';

export class Attribute {
    protected active = false;
    public type?: number;
    private swapArr: TypedArray;

    /**
     * @param buffer Buffer containing the data
     * @param size Size of the attribute (1, 2, 3 or 4)
     * @param normalized Whether the data should be normalized
     * @param stride Stride between each attribute
     * @param offset Offset of the first attribute
     */
    constructor(
        public buffer: Buffer,
        public size: number,
        public normalized: boolean = false,
        public stride: number = 0,
        public offset: number = 0
    ) {
        this.swapArr = cloneTypedArrayWithSize(buffer.data, size);
    }

    protected setup(gl: WebGL2RenderingContext, location: number) {
        if (location === undefined || location === -1) return;

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
        return this.buffer.data.length;
    }

    bind(gl: WebGL2RenderingContext, location: number) {
        if (!this.active) this.setup(gl, location);
        else this.buffer.bind(gl);
    }

    rebind(gl: WebGL2RenderingContext, location: number) {
        this.active = false;
        this.setup(gl, location);
    }

    applyMatrix(matrix: mat2 | mat3 | mat4) {
        this.buffer.applyMatrix(matrix, this.size);
    }

    swap(index1: number, index2: number) {
        const bufferIndex1 = index1 * (this.size + this.stride) + this.offset;
        const bufferIndex2 = index2 * (this.size + this.stride) + this.offset;
        this.buffer.swap(bufferIndex1, bufferIndex2, this.swapArr);
    }

    dispose(gl?: WebGL2RenderingContext) {
        if (this.active) {
            if (gl) this.buffer.dispose(gl);
            this.buffer = null as any;
            this.active = false;
        }
    }
}
