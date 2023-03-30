import { mat4 } from 'gl-matrix';
import {
    FlatMesh,
    IFCRELAGGREGATES,
    IFCRELASSOCIATESMATERIAL,
    IFCRELCONTAINEDINSPATIALSTRUCTURE,
    IFCRELDEFINESBYPROPERTIES,
    IFCRELDEFINESBYTYPE,
    IfcAPI,
    IfcGeometry,
    LoaderError,
    LoaderSettings,
    RawLineData,
    Vector,
} from 'web-ifc';

import { ContainerData, MaterialData, ModelData } from './components/Data';
import { ParserProgress } from './components/IFCParser';

export const IdAttrName = 'expressID';

export type IdAttributeByMaterial = { [id: number]: number };
export type IdAttributesByMaterials = { [materialID: string]: IdAttributeByMaterial };

export interface BaseSubsetConfig {
    parent?: ContainerData;
    ids: number[];
    removePrevious: boolean;
    material?: MaterialData;
    customID?: string;
    applyBVH?: boolean;
}

export interface SubsetConfig extends BaseSubsetConfig {
    modelID: number;
}

export const DEFAULT = 'default';

export type MapFaceindexID = { [key: number]: number };

export interface TypesMap {
    [key: number]: number;
}

export interface IfcModel {
    modelID: number;
    mesh: IfcMesh;
    types: TypesMap;
    jsonData: { [id: number]: JSONObject };
}

export interface JSONObject {
    expressID: number;
    type: string;
    [key: string]: any;
}

export interface Worker {
    active: boolean;
    path: string;
}

export interface IfcState {
    models: { [modelID: number]: IfcModel };
    api: IfcAPI;
    useJSON: boolean;
    webIfcSettings?: LoaderSettings;
    onProgress?: (event: ParserProgress) => void;
    coordinationMatrix?: mat4;
    wasmPath?: string;
}

export interface IfcMesh extends ModelData {
    modelID: number;
}

export interface Node {
    expressID: number;
    type: string;
    children: Node[];
}

export interface pName {
    name: number;
    relating: string;
    related: string;
    key: string;
}

export interface NewIfcModel {
    schema: string;
    name?: string;
    description?: string[];
    authors?: string[];
    organizations?: string[];
    authorization?: string;
}

export const PropsNames = {
    aggregates: {
        name: IFCRELAGGREGATES,
        relating: 'RelatingObject',
        related: 'RelatedObjects',
        key: 'children',
    },
    spatial: {
        name: IFCRELCONTAINEDINSPATIALSTRUCTURE,
        relating: 'RelatingStructure',
        related: 'RelatedElements',
        key: 'children',
    },
    psets: {
        name: IFCRELDEFINESBYPROPERTIES,
        relating: 'RelatingPropertyDefinition',
        related: 'RelatedObjects',
        key: 'hasPsets',
    },
    materials: {
        name: IFCRELASSOCIATESMATERIAL,
        relating: 'RelatingMaterial',
        related: 'RelatedObjects',
        key: 'hasMaterial',
    },
    type: {
        name: IFCRELDEFINESBYTYPE,
        relating: 'RelatingType',
        related: 'RelatedObjects',
        key: 'hasType',
    },
};
