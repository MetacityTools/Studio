import { Attribute } from './attribute';
import { ElementBuffer } from './elementBuffer';

export class ElementAttribute extends Attribute {
    constructor(buffer: ElementBuffer, size: number) {
        super(buffer, size, false, 0, 0);
    }

    protected setup(gl: WebGL2RenderingContext, _: number) {
        this.buffer.bind(gl);
        this.type = this.buffer.getDataType(gl);
        this.active = true;
    }

    bind(gl: WebGL2RenderingContext, location: number) {
        if (!this.active) this.setup(gl, location);
        else this.buffer.bind(gl);
    }
}
