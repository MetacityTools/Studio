import { mat4 } from 'gl-matrix';

export type Vec3 = [number, number, number];

export type BrickFace = Vec3[];
export type BrickModel = BrickFace[];
export type BrickRepr = string[];

export interface Brick {
    model: BrickModel;
    repr: BrickRepr;
}

//------------------------------------------------------------
//General

export type TypedArray =
    | Float32Array
    | Uint32Array
    | Uint16Array
    | Uint8Array
    | Int32Array
    | Int16Array
    | Int8Array;

//------------------------------------------------------------
//GLTF MODEL INTERFACE

export interface GLTFParsedData {
    nodes: GLTFNode[];
}

export interface GLTFNode {
    id: string;
    mesh?: GLTFMesh;
    name: string;
    matrix?: number[];
    rotation?: [number, number, number, number];
    scale?: [number, number, number];
    translation?: [number, number, number];
    camera?: any;
    extras?: any;
}

export interface GLTFMesh {
    id: string;
    name: string;
    primitives: {
        attributes: {
            POSITION: {
                value: Float32Array;
                type: string;
            };
        };
        indices?: {
            value: Uint16Array | Uint32Array;
        };
    }[];
}

//------------------------------------------------------------
//IFC MODEL INTERFACE

export interface IFCModelData {
    geometry: {
        expressID: Uint32Array;
        position: Float32Array;
        index: Uint32Array | Uint16Array;
    };
    materials: {
        color: number[];
        opacity: number;
    }[];
    matrix: mat4;
}

//------------------------------------------------------------
//MAIN MODEL INTERFACE

export interface UserInputModel {
    name: string;
    data: IFCData | GLTFData | ShapefileData;
}

export interface IFCData {
    buffer: ArrayBuffer;
}

export interface GLTFData {
    buffer: ArrayBuffer;
}

export interface ShapefileData {
    shp: ArrayBuffer;
    shx?: ArrayBuffer;
    dbf?: ArrayBuffer;
    prj?: ArrayBuffer;
    cpg?: ArrayBuffer;
}

export interface ModelData {
    geometry: ModelGeometry;
    metadata: ModelMetadata;
}

export interface ModelGeometry {
    position: Float32Array;
    submodel: Uint32Array;
}

export type PrimitiveType = 'triangle' | 'line' | 'point';

export interface ModelMetadata {
    name: string;
    data: { [submodel: number]: any };
    file?: ArrayBuffer;
    primitive: PrimitiveType;
}

export enum GeometryMode {
    WIREFRAME,
    SOLID,
}
