import { Attribute } from './attribute';
import { Buffer } from './buffer';

export class InstancedAttribute extends Attribute {
    private divisor: number;

    constructor(
        buffer: Buffer,
        size: number,
        divisor: number,
        normalized?: boolean,
        stride?: number,
        offset?: number
    ) {
        super(buffer, size, normalized, stride, offset);
        this.divisor = divisor;
    }

    protected setup(gl: WebGL2RenderingContext, location: number) {
        if (location === undefined || location === -1) return;

        super.setup(gl, location);
        gl.vertexAttribDivisor(location, this.divisor);
    }

    bind(gl: WebGL2RenderingContext, location: number) {
        if (!this.active) this.setup(gl, location);
        super.bind(gl, location);
    }
}
