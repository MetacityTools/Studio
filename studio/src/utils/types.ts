import { mat4 } from 'gl-matrix';

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

export interface ModelData {
    geometry: ModelGeometry;
    metadata: ModelMetadata;
    hierarchy?: ModelHierarchy;
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
}

export enum GeometryMode {
    WIREFRAME,
    SOLID,
    NOEDGES,
}

export interface ModelHierarchy {
    root: ModelHierarchyGroupNode;
}

export interface ModelHierarchyNode {
    data: { [data: string]: any };
}

export interface ModelHierarchyGroupNode extends ModelHierarchyNode {
    children: ModelHierarchyNode[];
}

export interface ModelHierarchyModelNode extends ModelHierarchyNode {
    id: number;
}

export interface ExtendedModelHierarchyModelNode extends ModelHierarchyModelNode {
    model?: any;
}

//------------------------------------------------------------
export interface MetadataNode {
    values?: MetadataValue;
    children?: {
        [key: string]: MetadataNode;
    };
}

export enum MetadataType {
    NONE,
    STRING,
    NUMBER,
    BOOLEAN,
    MIXED,
}

export interface MetadataValue {
    type: MetadataType;
    values: Set<string | number | boolean>;
}

export interface MetadataStringValue extends MetadataValue {
    type: MetadataType.STRING;
    values: Set<string>;
}

export interface MetadataNumberValue extends MetadataValue {
    type: MetadataType.NUMBER;
    values: Set<number>;
}

export interface MetadataBooleanValue extends MetadataValue {
    type: MetadataType.BOOLEAN;
    values: Set<boolean>;
}

export interface MetadataMixedValue extends MetadataValue {
    type: MetadataType.MIXED;
    values: Set<string | number | boolean>;
}
