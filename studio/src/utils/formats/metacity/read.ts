import { ModelData } from 'data/types';

import { ReadOnlyMemoryStream } from './streams';
import { ConstructableTypedArray } from './write';

export function readModels(buffer: ArrayBuffer): ModelData[] {
    const stream = new ReadOnlyMemoryStream(buffer);
    const version = readString(stream);
    if (version !== 'mtctv2') return readLegacy(stream);
    return readV2(stream);
}

function readLegacy(stream: ReadOnlyMemoryStream): ModelData[] {
    console.warn('Legacy metacity file detected, please re-export');
    stream.seek(0);
    return [readModel(stream)];
}

function readV2(stream: ReadOnlyMemoryStream): ModelData[] {
    const data: ModelData[] = [];
    while (!stream.empty()) {
        const model = readModel(stream);
        data.push(model);
    }
    return data;
}

function readModel(stream: ReadOnlyMemoryStream) {
    const positions = readTypedArray(stream, Float32Array) as Float32Array;
    const submodel = readTypedArray(stream, Uint32Array) as Uint32Array;
    const metaString = readString(stream);
    const metadata = JSON.parse(metaString);
    const name = readString(stream);
    const primitive = stream.readInt32();

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

function readTypedArray(stream: ReadOnlyMemoryStream, array: ConstructableTypedArray) {
    const length = stream.readInt32();
    const buffer = stream.readUint8Array(length * array.BYTES_PER_ELEMENT);
    return new array(buffer.buffer);
}

function readString(stream: ReadOnlyMemoryStream) {
    const length = stream.readInt32();
    const buffer = stream.readUint8Array(length);
    const decoder = new TextDecoder();
    return decoder.decode(buffer);
}
