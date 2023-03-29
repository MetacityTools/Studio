export interface UserInputModel {
    name: string;
    buffer: ArrayBuffer;
}

export type Vec3 = [number, number, number];

export type BrickFace = Vec3[];
export type BrickModel = BrickFace[];
export type BrickRepr = string[];

export interface Brick {
    model: BrickModel;
    repr: BrickRepr;
}
export type TypedArray =
    | Float32Array
    | Uint32Array
    | Uint16Array
    | Uint8Array
    | Int32Array
    | Int16Array
    | Int8Array;

export type IFCLoaderData = {
    name: string;
    data: {
        [key: string]: TypedArray;
    };
};
