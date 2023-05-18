import { TypedArray } from '@utils/types';

import { Attribute, ElementAttribute, InstancedAttribute } from '@bananagl/bananagl';

export function encodeArrayType(array: TypedArray) {
    if (array instanceof Float32Array) {
        return 0;
    } else if (array instanceof Uint32Array) {
        return 1;
    } else if (array instanceof Uint16Array) {
        return 2;
    } else if (array instanceof Uint8Array) {
        return 3;
    } else if (array instanceof Int32Array) {
        return 4;
    } else if (array instanceof Int16Array) {
        return 5;
    } else if (array instanceof Int8Array) {
        return 6;
    } else {
        throw new Error('Invalid TypedArray type');
    }
}

export function decodeArrayType(type: number) {
    switch (type) {
        case 0:
            return Float32Array;
        case 1:
            return Uint32Array;
        case 2:
            return Uint16Array;
        case 3:
            return Uint8Array;
        case 4:
            return Int32Array;
        case 5:
            return Int16Array;
        case 6:
            return Int8Array;
        default:
            throw new Error('Invalid TypedArray type');
    }
}

export function encodeAttributeType(attr: Attribute | InstancedAttribute | ElementAttribute) {
    if (attr instanceof InstancedAttribute) {
        return 0;
    } else if (attr instanceof ElementAttribute) {
        return 1;
    } else if (attr instanceof Attribute) {
        return 2;
    } else {
        throw new Error('Invalid Attribute type');
    }
}

export function decodeAttributeType(type: number) {
    switch (type) {
        case 0:
            return InstancedAttribute;
        case 1:
            return ElementAttribute;
        case 2:
            return Attribute;
        default:
            throw new Error('Invalid Attribute type');
    }
}
