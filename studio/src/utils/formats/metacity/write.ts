import { TypedArray } from '@bananagl/bananagl';

import { EditorModelData } from '@data/EditorModel';
import { Style } from '@data/types';

import { WriteOnlyMemoryStream } from './streams';

export function exportModel(models: EditorModelData[], styles: Style, title: string) {
    const stream = new WriteOnlyMemoryStream();
    //write version
    writeString('mtctv2', stream);

    //write models
    for (const model of models) writeModel(model, stream);
    stream.close();

    const file = new File(stream.buffers, 'project.metacity', { type: 'application/octet-stream' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.mcmodel`;
    a.click();
    URL.revokeObjectURL(url);

    //sleep a bit
    setTimeout(() => {
        const styleData = JSON.stringify(styles);
        const styleFile = new File([styleData], 'styles.json', { type: 'application/json' });
        const styleUrl = URL.createObjectURL(styleFile);
        const styleA = document.createElement('a');
        styleA.href = styleUrl;
        styleA.download = `${title}.mcstyle`;
        styleA.click();
        URL.revokeObjectURL(styleUrl);
    }, 1000);
}

function writeModel(model: EditorModelData, stream: WriteOnlyMemoryStream) {
    writeTypedArray(model.geometry.position, stream);
    writeTypedArray(model.geometry.submodel, stream);

    const metadata = JSON.stringify(model.metadata.data);
    writeString(metadata, stream);
    writeString(model.metadata.name, stream);
    stream.writeInt32(model.metadata.primitive);
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
