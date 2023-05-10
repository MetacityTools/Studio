import { TypedArray } from 'types';

import { Attribute } from '@bananagl/bananagl';

import { BVHNode } from '../bvh';
import BuilderWorker from './worker?worker';

interface BufferData {
    data: TypedArray;
}

interface AttributeData {
    name: string;
    buffer: BufferData;
    size: number;
    normalized: boolean;
    stride: number;
    offset: number;
}

export interface TriangleBuildInput {
    position: AttributeData;
    attrs: AttributeData[];
}

export interface BuilderOutput {
    data: TriangleBuildInput;
    rootNode: BVHNode;
}

export async function buildBVHInWorker(position: Attribute, attr: Attribute[]) {
    const data = toTransferable(position, attr);
    const transferables = getTrasferables(data);
    return new Promise<BVHNode>((resolve) => {
        const worker = new BuilderWorker();
        worker.onmessage = (e) => {
            const data = e.data as BuilderOutput;
            fromTransferable(position, attr, data.data);
            resolve(data.rootNode);
            worker.terminate();
        };
        worker.postMessage(data, transferables);
    });
}

export function toTransferable(position: Attribute, attr: Attribute[]) {
    const data: TriangleBuildInput = {
        position: {
            name: position.name,
            buffer: {
                data: position.buffer.data,
            },
            size: position.size,
            normalized: position.normalized,
            stride: position.stride,
            offset: position.offset,
        },
        attrs: attr.map((a) => ({
            name: a.name,
            buffer: {
                data: a.buffer.data,
            },
            size: a.size,
            normalized: a.normalized,
            stride: a.stride,
            offset: a.offset,
        })),
    };

    return data;
}

export function getTrasferables(data: TriangleBuildInput) {
    return [data.position.buffer.data.buffer, ...data.attrs.map((a) => a.buffer.data.buffer)];
}

function fromTransferable(position: Attribute, attr: Attribute[], data: TriangleBuildInput) {
    position.buffer.data = data.position.buffer.data;
    attr.forEach((a, i) => {
        a.buffer.data = data.attrs[i].buffer.data;
    });
}
