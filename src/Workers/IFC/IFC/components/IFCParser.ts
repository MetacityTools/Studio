//@ts-ignore
import { mat4 } from 'gl-matrix';
import {
    FlatMesh,
    IFCOPENINGELEMENT,
    IFCPRODUCTDEFINITIONSHAPE,
    IFCSPACE,
    IfcGeometry,
    PlacedGeometry,
    Color as ifcColor,
} from 'web-ifc';

import { IfcMesh, IfcState } from '../BaseDefinitions';
import { GeometryData, MaterialData, ModelData, mergeBufferGeometries, tmat4 } from './Data';
import { IFCModel } from './IFCModel';

export interface ParserProgress {
    loaded: number;
    total: number;
}

export interface OptionalCategories {
    [category: number]: boolean;
}

export interface ParserAPI {
    parse(buffer: any, coordinationMatrix?: number[]): Promise<IFCModel>;

    getAndClearErrors(_modelId: number): void;

    setupOptionalCategories(config: OptionalCategories): Promise<void>;

    optionalCategories: OptionalCategories;
}

export interface GeometriesByMaterial {
    [materialID: string]: {
        material: MaterialData;
        geometries: GeometryData[];
    };
}

export class IFCParser implements ParserAPI {
    loadedModels = 0;

    optionalCategories: OptionalCategories = {
        [IFCSPACE]: true,
        [IFCOPENINGELEMENT]: false,
    };

    private geometriesByMaterials: GeometriesByMaterial = {};

    private loadingState = {
        total: 0,
        current: 0,
        step: 0.1,
    };

    // Represents the index of the model in webIfcAPI
    private currentWebIfcID = -1;
    // When using JSON data for optimization, webIfcAPI is reinitialized every time a model is loaded
    // This means that currentID is always 0, while currentModelID is the real index of stored models
    private currentModelID = -1;

    // BVH is optional because when using workers we have to apply it in the main thread,
    // once the model has been serialized and reconstructed
    constructor(private state: IfcState) {}

    async setupOptionalCategories(config: OptionalCategories) {
        this.optionalCategories = config;
    }

    async parse(buffer: ArrayBuffer, coordinationMatrix?: number[]) {
        if (this.state.api.wasmModule === undefined) await this.state.api.Init();
        await this.newIfcModel(buffer);
        this.loadedModels++;
        if (coordinationMatrix) {
            await this.state.api.SetGeometryTransformation(
                this.currentWebIfcID,
                coordinationMatrix
            );
        }
        return this.loadAllGeometry(this.currentWebIfcID);
    }

    getAndClearErrors(_modelId: number) {
        // return this.state.api.GetAndClearErrors(modelId);
    }

    private notifyProgress(loaded: number, total: number) {
        if (this.state.onProgress) this.state.onProgress({ loaded, total });
    }

    private async newIfcModel(buffer: ArrayBuffer) {
        const data = new Uint8Array(buffer);
        this.currentWebIfcID = await this.state.api.OpenModel(data, this.state.webIfcSettings);
        this.currentModelID = this.state.useJSON ? this.loadedModels : this.currentWebIfcID;
        this.state.models[this.currentModelID] = {
            modelID: this.currentModelID,
            mesh: {} as IfcMesh,
            types: {},
            jsonData: {},
        };
    }

    private async loadAllGeometry(modelID: number) {
        this.addOptionalCategories(modelID);
        await this.initializeLoadingState(modelID);

        this.state.api.StreamAllMeshes(modelID, (mesh: FlatMesh) => {
            this.updateLoadingState();
            // only during the lifetime of this function call, the geometry is available in memory
            this.streamMesh(modelID, mesh);
        });

        this.notifyLoadingEnded();
        const geometries: GeometryData[] = [];
        const materials: MaterialData[] = [];

        Object.keys(this.geometriesByMaterials).forEach((key) => {
            const geometriesByMaterial = this.geometriesByMaterials[key].geometries;
            const merged = mergeBufferGeometries(geometriesByMaterial);
            materials.push(this.geometriesByMaterials[key].material);
            geometries.push(merged);
        });

        const combinedGeometry = mergeBufferGeometries(geometries, true);
        this.cleanUpGeometryMemory(geometries);
        const model = new IFCModel(combinedGeometry, materials);
        this.state.models[this.currentModelID].mesh = model;
        return model;
    }

    private async initializeLoadingState(modelID: number) {
        const shapes = await this.state.api.GetLineIDsWithType(modelID, IFCPRODUCTDEFINITIONSHAPE);
        this.loadingState.total = shapes.size();
        this.loadingState.current = 0;
        this.loadingState.step = 0.1;
    }

    private notifyLoadingEnded() {
        this.notifyProgress(this.loadingState.total, this.loadingState.total);
    }

    private updateLoadingState() {
        const realCurrentItem = Math.min(this.loadingState.current++, this.loadingState.total);
        if (realCurrentItem / this.loadingState.total >= this.loadingState.step) {
            const currentProgress = Math.ceil(this.loadingState.total * this.loadingState.step);
            this.notifyProgress(currentProgress, this.loadingState.total);
            this.loadingState.step += 0.1;
        }
    }

    // Some categories (like IfcSpace and IfcOpeningElement) need to be set explicitly
    private addOptionalCategories(modelID: number) {
        const optionalTypes: number[] = [];

        for (let key in this.optionalCategories) {
            if (this.optionalCategories.hasOwnProperty(key)) {
                const category = parseInt(key);
                if (this.optionalCategories[category]) optionalTypes.push(category);
            }
        }

        this.state.api.StreamAllMeshesWithTypes(
            this.currentWebIfcID,
            optionalTypes,
            (mesh: FlatMesh) => {
                this.streamMesh(modelID, mesh);
            }
        );
    }

    private streamMesh(modelID: number, mesh: FlatMesh) {
        const placedGeometries = mesh.geometries;
        const size = placedGeometries.size();

        for (let i = 0; i < size; i++) {
            const placedGeometry = placedGeometries.get(i);
            let itemMesh = this.getPlacedGeometry(modelID, mesh.expressID, placedGeometry);
            itemMesh.geometry.applyMatrix4(itemMesh.matrix);
            this.storeGeometryByMaterial(placedGeometry.color, itemMesh.geometry);
        }
    }

    private getPlacedGeometry(modelID: number, expressID: number, placedGeometry: PlacedGeometry) {
        const geometry = this.getBufferGeometry(modelID, expressID, placedGeometry);
        const mesh = new ModelData(geometry);
        mesh.matrix = this.getMeshMatrix(placedGeometry.flatTransformation);
        return mesh;
    }

    private getBufferGeometry(modelID: number, expressID: number, placedGeometry: PlacedGeometry) {
        const geometry = this.state.api.GetGeometry(
            modelID,
            placedGeometry.geometryExpressID
        ) as IfcGeometry;
        const verts = this.state.api.GetVertexArray(
            geometry.GetVertexData(),
            geometry.GetVertexDataSize()
        ) as Float32Array;
        const indices = this.state.api.GetIndexArray(
            geometry.GetIndexData(),
            geometry.GetIndexDataSize()
        ) as Uint32Array;
        const buffer = this.ifcGeometryToBuffer(expressID, verts, indices);
        //@ts-ignore
        geometry.delete();
        return buffer;
    }

    private storeGeometryByMaterial(color: ifcColor, geometry: GeometryData) {
        let colID = `${color.x}${color.y}${color.z}${color.w}`;
        if (this.geometriesByMaterials[colID]) {
            this.geometriesByMaterials[colID].geometries.push(geometry);
        } else {
            // Assume RGB components are in sRGB-Rec709-D65 colorspace
            const c_arr: [number, number, number] = [color.x, color.y, color.z];
            const transparent = color.w !== 1;
            const opacity = color.w;
            const material = new MaterialData(c_arr, opacity, transparent);
            this.geometriesByMaterials[colID] = { material, geometries: [geometry] };
        }
    }

    private getMeshMatrix(matrix: Array<number>) {
        if (matrix.length !== 16) throw new Error('Invalid matrix length');
        const mat = mat4.fromValues(...(matrix as tmat4));
        return mat;
    }

    private ifcGeometryToBuffer(
        expressID: number,
        vertexData: Float32Array,
        indexData: Uint32Array
    ) {
        const geometry = new GeometryData();

        const posFloats = new Float32Array(vertexData.length / 2);
        const normFloats = new Float32Array(vertexData.length / 2);
        const idAttribute = new Uint32Array(vertexData.length / 6);

        for (let i = 0; i < vertexData.length; i += 6) {
            posFloats[i / 2] = vertexData[i];
            posFloats[i / 2 + 1] = vertexData[i + 1];
            posFloats[i / 2 + 2] = vertexData[i + 2];

            normFloats[i / 2] = vertexData[i + 3];
            normFloats[i / 2 + 1] = vertexData[i + 4];
            normFloats[i / 2 + 2] = vertexData[i + 5];

            idAttribute[i / 6] = expressID;
        }

        geometry.position = posFloats;
        geometry.normal = normFloats;
        geometry.expressID = idAttribute;
        geometry.setIndex(indexData);
        return geometry;
    }

    private cleanUpGeometryMemory(geometries: GeometryData[]) {
        geometries.forEach((geometry) => geometry.dispose());

        Object.keys(this.geometriesByMaterials).forEach((materialID) => {
            const geometriesByMaterial = this.geometriesByMaterials[materialID];
            geometriesByMaterial.geometries.forEach((geometry) => geometry.dispose());
            geometriesByMaterial.geometries = [];
            // @ts-ignore
            geometriesByMaterial.material = null;
        });
        this.geometriesByMaterials = {};
    }
}
