import { ModelData } from '@utils/types';

import { ReadOnlyMemoryStream } from './streams';
import { ConstructableTypedArray } from './write';

function readTypedArray(stream: ReadOnlyMemoryStream, array: ConstructableTypedArray) {
    const length = stream.readInt32();
    console.log('length', length);
    const buffer = stream.readUint8Array(length * array.BYTES_PER_ELEMENT);
    return new array(buffer.buffer);
}

function readString(stream: ReadOnlyMemoryStream) {
    const length = stream.readInt32();
    const buffer = stream.readUint8Array(length);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}

export function readModel(buffer: ArrayBuffer): ModelData {
    const stream = new ReadOnlyMemoryStream(buffer);
    const positions = readTypedArray(stream, Float32Array) as Float32Array;
    const submodel = readTypedArray(stream, Uint32Array) as Uint32Array;
    const metaString = readString(stream);
    const metadata = JSON.parse(metaString);
    const name = readString(stream);
    const primitive = stream.readInt32();
    //stream.close();

    console.log('metadata', metadata);

    return {
        geometry: {
            position: positions,
            submodel: submodel,
        },
        metadata: {
            data: metadata,
            name: name,
            primitive: primitive,
        },
    };
}
