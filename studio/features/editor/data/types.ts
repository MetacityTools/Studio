import { mat4, vec3 } from "gl-matrix";

//------------------------------------------------------------
//GLTF MODEL INTERFACE

export type GLTFParsedData = {
  nodes: GLTFNode[];
};

export type GLTFNode = {
  id: string;
  mesh?: GLTFMesh;
  name: string;
  matrix?: number[];
  rotation?: [number, number, number, number];
  scale?: [number, number, number];
  translation?: [number, number, number];
  camera?: any;
  extras?: any;
  children?: any[];
};

export type GLTFMesh = {
  id: string;
  name?: string;
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
};

//------------------------------------------------------------
//IFC MODEL INTERFACE

export type IFCModelData = {
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
};

//------------------------------------------------------------
//MAIN MODEL INTERFACE

export type UserInputModel = {
  name: string;
  data: IFCData | GLTFData | ShapefileData | MetacityData;
};

export type MetacityData = {
  buffer: ArrayBuffer;
};

export type IFCData = {
  buffer: ArrayBuffer;
};

export type GLTFData = {
  buffer: ArrayBuffer;
};

export type ShapefileData = {
  shp: ArrayBuffer;
  shx?: ArrayBuffer;
  dbf?: ArrayBuffer;
  prj?: ArrayBuffer;
  cpg?: ArrayBuffer;
};

//hierarchy is optional because some models don't use
//the hierarchical structure
export type ModelData = {
  uuid: string;
  geometry: ModelGeometry;
  metadata: ModelMetadata;
};

export type ModelGeometry = {
  position: Float32Array;
  submodel: Uint32Array;
};

export enum PrimitiveType {
  POINTS,
  LINES,
  TRIANGLES,
  UNDEFINED,
}

export type ModelMetadata = {
  name: string;
  visible: boolean;
  primitive: PrimitiveType;
  data: ModelMetadataRecords;
};

export type ModelMetadataRecord = {
  [key: string]: string | number;
};

export type ModelMetadataRecords = {
  [submodel: number]: ModelMetadataRecord;
};

export enum GeometryMode {
  WIREFRAME = "WIREFRAME",
  SOLID = "SOLID",
  NOEDGES = "NOEDGES",
}

//------------------------------------------------------------
export type Style = {
  [key: string]: StyleRecord | undefined;
};

export type StyleRecord = {
  [value: string | number]:
    | {
        code: string;
        vec: vec3;
      }
    | undefined;
};

export type ModelStyle = {
  [key: string]: ModelStyleRecord | undefined;
};

export type ModelStyleRecord = {
  [modelId: string]:
    | {
        geometryMode: GeometryMode;
      }
    | undefined;
};
