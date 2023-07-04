import { EditorModelData } from '@utils/utils';

import { TypedArray } from '@bananagl/bananagl';

import { WriteOnlyMemoryStream } from './streams';

export function exportModel(model: EditorModelData) {
    const stream = new WriteOnlyMemoryStream();

    writeTypedArray(model.geometry.position, stream);
    console.log('expected length', model.geometry.position.length);
    writeTypedArray(model.geometry.submodel, stream);
    console.log('expected length', model.geometry.submodel.length);

    const metadata = JSON.stringify(model.metadata.data);
    writeString(metadata, stream);
    writeString(model.metadata.name, stream);
    stream.writeInt32(model.metadata.primitive);
    stream.close();

    const file = new File(stream.buffers, 'project.metacity', { type: 'application/octet-stream' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.metacity';
    a.click();

    URL.revokeObjectURL(url);
}

export interface ConstructableTypedArray {
    new (buffer: ArrayBuffer): TypedArray;
    BYTES_PER_ELEMENT: number;
}

function writeTypedArray(array: TypedArray, stream: WriteOnlyMemoryStream) {
    const length = array.length;
    stream.writeInt32(length);
    stream.writeUint8Array(array.buffer);
}

function writeString(string: string, stream: WriteOnlyMemoryStream) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(string);
    stream.writeInt32(encoded.length);
    stream.writeUint8Array(encoded);
}
