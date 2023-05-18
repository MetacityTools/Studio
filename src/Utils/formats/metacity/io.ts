import { EditorModel } from '@utils/models/models/EditorModel';
import { TypedArray } from '@utils/types';

import { InstancedAttribute } from '@bananagl/bananagl';

import {
    decodeArrayType,
    decodeAttributeType,
    encodeArrayType,
    encodeAttributeType,
} from './encoding';
import { ReadOnlyMemoryStream, WriteOnlyMemoryStream } from './streams';

function writeTypedArray(array: TypedArray, stream: WriteOnlyMemoryStream) {
    const type = encodeArrayType(array);
    stream.writeUint8(type);
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

export async function exportModels(models: EditorModel[]) {
    const stream = new WriteOnlyMemoryStream();

    for (const model of models) {
        //attributes
        const attributes = model.attributes.rawAttributes;
        attributes.forEach((attribute) => {
            writeString(attribute.name, stream);
            stream.writeUint8(encodeAttributeType(attribute));
            stream.writeInt32(attribute.size);
            stream.writeUint8(attribute.normalized ? 1 : 0);
            stream.writeInt32(attribute.stride);
            stream.writeInt32(attribute.offset);
            if (attribute instanceof InstancedAttribute) stream.writeInt32(attribute.divisor);
            const data = attribute.buffer.data;
            writeTypedArray(data, stream);
        });

        //metadata and transforms
        stream.writeFloat32(model.position[0]);
        stream.writeFloat32(model.position[1]);
        stream.writeFloat32(model.position[2]);

        stream.writeFloat32(model.rotation[0]);
        stream.writeFloat32(model.rotation[1]);
        stream.writeFloat32(model.rotation[2]);

        stream.writeFloat32(model.scale[0]);
        stream.writeFloat32(model.scale[1]);
        stream.writeFloat32(model.scale[2]);

        writeString(model.name, stream);
        writeString(model.primitive, stream);
        const metadata = JSON.stringify(model.data);
        writeString(metadata, stream);

        //uniforms
        const uniforms = model.uniforms;
        stream.writeFloat32(uniforms.uZMin as number);
        stream.writeFloat32(uniforms.uZMax as number);
    }

    stream.close();

    const file = new File(stream.buffers, 'project.metacity', { type: 'application/octet-stream' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.metacity';
    a.click();

    URL.revokeObjectURL(url);
}

function readTypedArray(stream: ReadOnlyMemoryStream) {
    const type = stream.readUint8();
    const array = decodeArrayType(type);
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

export async function importModels(file: File) {
    const stream = new ReadOnlyMemoryStream(await file.arrayBuffer());
    //TODO
}
