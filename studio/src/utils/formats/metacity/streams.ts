export class WriteOnlyMemoryStream {
    buffers: Uint8Array[] = [];
    unfinishedBuffer: number[] = [];
    MAX_BUFFER_SIZE = 1024 * 1024 * 10; // 10MB

    writeUint8(byte: number) {
        this.unfinishedBuffer.push(byte);
        this.add();
    }

    writeInt32(int: number) {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setInt32(0, int, true);
        this.unfinishedBuffer.push(...new Uint8Array(buffer));
        this.add();
    }

    writeFloat32(float: number) {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, float, true);
        this.unfinishedBuffer.push(...new Uint8Array(buffer));
        this.add();
    }

    writeUint8Array(array: ArrayBuffer) {
        const buffer = new Uint8Array(array);
        for (let i = 0; i < buffer.length; i++) {
            this.unfinishedBuffer.push(buffer[i]);
            this.add();
        }
    }

    add() {
        if (this.unfinishedBuffer.length >= this.MAX_BUFFER_SIZE) {
            this.flush();
        }
    }

    private flush() {
        this.buffers.push(new Uint8Array(this.unfinishedBuffer));
        this.unfinishedBuffer.length = 0;
    }

    close() {
        this.flush();
    }
}

export class ReadOnlyMemoryStream {
    position = 0;
    buffer: Uint8Array;
    constructor(buffer: ArrayBuffer) {
        this.buffer = new Uint8Array(buffer);
    }

    seek(position: number) {
        this.position = position;
    }

    readUint8() {
        const byte = this.buffer[this.position];
        this.position += 1;
        return byte;
    }

    readInt32() {
        const buffer = this.buffer.slice(this.position, this.position + 4);
        const view = new DataView(buffer.buffer);
        const float = view.getInt32(0, true);
        this.position += 4;
        return float;
    }

    readFloat32() {
        const buffer = this.buffer.slice(this.position, this.position + 4);
        const view = new DataView(buffer.buffer);
        const float = view.getFloat32(0, true);
        this.position += 4;
        return float;
    }

    readUint8Array(length: number) {
        const array = new Uint8Array(length);
        const view = new Uint8Array(this.buffer.buffer, this.position, length);
        array.set(view);
        this.position += length;
        return array;
    }

    readInt32Array(length: number) {
        const array = new Int32Array(length);
        const view = new Int32Array(this.buffer.buffer, this.position, length);
        array.set(view);
        this.position += length * 4;
        return array;
    }

    readFloat32Array(length: number) {
        const array = new Float32Array(length);
        const view = new Float32Array(this.buffer.buffer, this.position, length);
        array.set(view);
        this.position += length * 4;
        return array;
    }
}
