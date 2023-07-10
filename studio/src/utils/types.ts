import { mat4, vec3 } from 'gl-matrix';

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
    data: IFCData | GLTFData | ShapefileData | MetacityData;
}

export interface MetacityData {
    buffer: ArrayBuffer;
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

//hierarchy is optional because some models don't use
//the hierarchical structure
export interface ModelData {
    geometry: ModelGeometry;
    metadata: ModelMetadata;
}

export interface ModelGeometry {
    position: Float32Array;
    submodel: Uint32Array;
}

export enum PrimitiveType {
    POINTS,
    LINES,
    TRIANGLES,
    UNDEFINED,
}

export interface ModelMetadata {
    name: string;
    primitive: PrimitiveType;
    data: Metadata;
}

export interface Metadata {
    [submodel: number]: any;
}

export enum GeometryMode {
    WIREFRAME,
    SOLID,
    NOEDGES,
}

//------------------------------------------------------------
export interface MetadataNode {
    values?: any[];
    children?: Map<string, MetadataNode>;
}

//------------------------------------------------------------
export interface StyleNode {
    style?: {
        random?: boolean;
        scalars?: {
            colormap: string[];
            min: number;
            max: number;
        };
        categories?: {
            [key: string]: string;
        };
    };
    children?: {
        [key: string]: StyleNode;
    };
}
