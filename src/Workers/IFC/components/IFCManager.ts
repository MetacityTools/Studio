import { mat4 } from 'gl-matrix';
import * as WebIFC from 'web-ifc';
import { LoaderSettings } from 'web-ifc';

import { IfcState, SubsetConfig } from '../BaseDefinitions';
import { ContainerData, GeometryData, MaterialData } from './Data';
import { IFCModel } from './IFCModel';
import { IFCParser, ParserProgress } from './IFCParser';
import { IFCUtils } from './IFCUtils';
import { MemoryCleaner } from './MemoryCleaner';
import { TypeManager } from './TypeManager';
import { PropertyManagerAPI } from './properties/BaseDefinitions';
import { PropertyManager } from './properties/PropertyManager';
import { Data } from './sequence/Data';
import { SubsetManager } from './subsets/SubsetManager';

/**
 * Contains all the logic to work with the loaded IFC files (select, edit, etc).
 */
export class IFCManager {
    state: IfcState = {
        models: [],
        api: new WebIFC.IfcAPI(),
        useJSON: false,
    };

    parser = new IFCParser(this.state);
    subsets = new SubsetManager(this.state);
    utils = new IFCUtils(this.state);
    sequenceData = new Data(this.state);
    properties: PropertyManagerAPI = new PropertyManager(this.state);
    types = new TypeManager(this.state);

    useFragments = false;

    private cleaner = new MemoryCleaner(this.state);

    constructor() {}

    /**
     * Returns the underlying web-ifc API.
     */
    get ifcAPI() {
        return this.state.api;
    }

    // SETUP - all the logic regarding the configuration of web-ifc-three

    async parse(buffer: ArrayBuffer) {
        let model = (await this.parser.parse(
            buffer,
            this.state.coordinationMatrix as number[]
        )) as IFCModel;
        model.setIFCManager(this);
        // this.state.useJSON ? await this.disposeMemory() : await this.types.getAllTypes(this.worker);
        await this.types.getAllTypes();
        return model;
    }

    /**
     * Sets the relative path of web-ifc.wasm file in the project.
     * Beware: you **must** serve this file in your page; this means
     * that you have to copy this files from *node_modules/web-ifc*
     * to your deployment directory.
     *
     * If you don't use this methods,
     * IFC.js assumes that you are serving it in the root directory.
     *
     * Example if web-ifc.wasm is in dist/wasmDir:
     * `ifcLoader.setWasmPath("dist/wasmDir/");`
     *
     * @path Relative path to web-ifc.wasm.
     */
    async setWasmPath(path: string, isAbsolute = false) {
        this.state.api.SetWasmPath(path, isAbsolute);
    }

    /**
     * Sets a callback function that is called every 10% of IFC loaded.
     * @onProgress callback function
     */
    setOnProgress(onProgress: (event: ParserProgress) => void) {
        this.state.onProgress = onProgress;
    }

    /**
     * Sets a coordination matrix to be applied when loading geometry.
     * @matrix THREE.Matrix4
     */
    setupCoordinationMatrix(matrix: mat4) {
        this.state.coordinationMatrix = matrix;
    }

    /**
     * Clears the coordination matrix that is applied when loading geometry.
     */
    clearCoordinationMatrix() {
        delete this.state.coordinationMatrix;
    }

    /**
     * Applies a configuration for [web-ifc](https://ifcjs.github.io/info/docs/Guide/web-ifc/Introduction).
     */
    async applyWebIfcConfig(settings: LoaderSettings) {
        this.state.webIfcSettings = settings;
    }

    /**
     * Closes the specified model and deletes it from the [scene](https://threejs.org/docs/#api/en/scenes/Scene).
     * @modelID ID of the IFC model.
     * @scene Scene where the model is (if it's located in a scene).
     */
    close(modelID: number, scene?: ContainerData) {
        try {
            this.state.api.CloseModel(modelID);
            const mesh = this.state.models[modelID].mesh;
            const { geometry } = mesh;
            if (scene) scene.remove(mesh);
            geometry?.dispose();
            delete this.state.models[modelID];
        } catch (e) {
            console.warn(`Close IFCModel ${modelID} failed`);
        }
    }

    /**
     * Gets the **Express ID** to which the given face belongs.
     * This ID uniquely identifies this entity within this IFC file.
     * @geometry The geometry IFC model.
     * @faceIndex The index of the face of a geometry.You can easily get this index using the [Raycaster](https://threejs.org/docs/#api/en/core/Raycaster).
     */
    getExpressId(geometry: GeometryData, faceIndex: number) {
        return this.properties.getExpressId(geometry, faceIndex);
    }

    /**
     * Returns all items of the specified type. You can import
     * the types from *web-ifc*.
     *
     * Example to get all the standard walls of a project:
     * ```js
     * import { IFCWALLSTANDARDCASE } from 'web-ifc';
     * const walls = ifcLoader.getAllItemsOfType(IFCWALLSTANDARDCASE);
     * ```
     * @modelID ID of the IFC model.
     * @type type of IFC items to get.
     * @verbose If false (default), this only gets IDs. If true, this also gets the native properties of all the fetched items.
     */
    getAllItemsOfType(modelID: number, type: number, verbose: boolean) {
        return this.properties.getAllItemsOfType(modelID, type, verbose);
    }

    /**
     * Gets the native properties of the given element.
     * @modelID ID of the IFC model.
     * @id Express ID of the element.
     * @recursive Wether you want to get the information of the referenced elements recursively.
     */
    getItemProperties(modelID: number, id: number, recursive = false) {
        return this.properties.getItemProperties(modelID, id, recursive);
    }

    /**
     * Gets the [property sets](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifckernel/lexical/ifcpropertyset.htm)
     * assigned to the given element.
     * @modelID ID of the IFC model.
     * @id Express ID of the element.
     * @recursive If true, this gets the native properties of the referenced elements recursively.
     */
    getPropertySets(modelID: number, id: number, recursive = false) {
        return this.properties.getPropertySets(modelID, id, recursive);
    }

    /**
     * Gets the properties of the type assigned to the element.
     * For example, if applied to a wall (IfcWall), this would get back the information
     * contained in the IfcWallType assigned to it, if any.
     * @modelID ID of the IFC model.
     * @id Express ID of the element.
     * @recursive If true, this gets the native properties of the referenced elements recursively.
     */
    getTypeProperties(modelID: number, id: number, recursive = false) {
        return this.properties.getTypeProperties(modelID, id, recursive);
    }

    /**
     * Gets the materials assigned to the given element.
     * @modelID ID of the IFC model.
     * @id Express ID of the element.
     * @recursive If true, this gets the native properties of the referenced elements recursively.
     */
    getMaterialsProperties(modelID: number, id: number, recursive = false) {
        return this.properties.getMaterialsProperties(modelID, id, recursive);
    }

    /**
     * Gets the ifc type of the specified item.
     * @modelID ID of the IFC model.
     * @id Express ID of the element.
     */
    getIfcType(modelID: number, id: number) {
        const typeID = this.state.models[modelID].types[id];
        return this.state.api.GetNameFromTypeCode(typeID);
    }

    /**
     * Gets the spatial structure of the project. The
     * [spatial structure](https://standards.buildingsmart.org/IFC/DEV/IFC4_2/FINAL/HTML/schema/ifcproductextension/lexical/ifcspatialstructureelement.htm)
     * is the hierarchical structure that organizes every IFC project (all physical items
     * are referenced to an element of the spatial structure). It is formed by
     * one IfcProject that contains one or more IfcSites, that contain one or more
     * IfcBuildings, that contain one or more IfcBuildingStoreys, that contain
     * one or more IfcSpaces.
     * @modelID ID of the IFC model.
     */
    getSpatialStructure(modelID: number, includeProperties?: boolean) {
        return this.properties.getSpatialStructure(modelID, includeProperties);
    }

    /**
     * Gets the mesh of the subset with the specified [material](https://threejs.org/docs/#api/en/materials/Material).
     * If no material is given, this returns the subset with the original materials.
     * @modelID ID of the IFC model.
     * @material Material assigned to the subset (if any).
     * @customId Optional identifier of the subset.
     */
    getSubset(modelID: number, material?: MaterialData, customId?: string) {
        return this.subsets.getSubset(modelID, material, customId);
    }

    /**
     * Removes the specified subset.
     * @modelID ID of the IFC model.
     * @parent The parent where the subset is (can be any `THREE.Object3D`).
     * @material Material assigned to the subset, if any.
     */
    removeSubset(modelID: number, material?: MaterialData, customID?: string) {
        this.subsets.removeSubset(modelID, material, customID);
    }

    /**
     * Creates a new geometric subset.
     * @config A configuration object with the following options:
     * - **scene**: `THREE.Object3D` where the model is located.
     * - **modelID**: ID of the model.
     * - **ids**: Express IDs of the items of the model that will conform the subset.
     * - **removePrevious**: wether to remove the previous subset of this model with this material.
     * - **material**: (optional) wether to apply a material to the subset.
     * - **customID**: (optional) custom identifier to distinguish subsets of the same model with the same material.
     */
    createSubset(config: SubsetConfig) {
        return this.subsets.createSubset(config);
    }

    /**
     * Removes the specified items from the geometry of a subset.
     * @modelID ID of the IFC model.
     * @ids Express IDs of the items of the model that will conform the subset.
     * @material (optional) Material assigned to the subset, if any.
     * @customID (optional) custom identifier to distinguish subsets of the same model with the same material.
     */
    removeFromSubset(modelID: number, ids: number[], customID?: string, material?: MaterialData) {
        return this.subsets.removeFromSubset(modelID, ids, customID, material);
    }

    /**
     * Removes all the geometry of a subset.
     * @modelID ID of the IFC model.
     * @ids Express IDs of the items of the model that will conform the subset.
     * @material (optional) Material assigned to the subset, if any.
     * @customID (optional) custom identifier to distinguish subsets of the same model with the same material.
     */
    clearSubset(modelID: number, customID?: string, material?: MaterialData) {
        return this.subsets.clearSubset(modelID, customID, material);
    }

    // UTILITIES - Miscelaneus logic for various purposes

    /**
     * Returns the IFC class name of an instance if the optional parameter is not provided.
     * If an entit class is provided, it will check if an instance belongs to the class.
     * @modelID ID of the IFC model.
     * @entityClass IFC Class name.
     */
    async isA(entity: any, entity_class: string) {
        return this.utils.isA(entity, entity_class);
    }

    async getSequenceData(modelID: number) {
        await this.sequenceData.load(modelID);
        return this.sequenceData;
    }

    /**
     * Returns the IFC objects filtered by IFC Type and wrapped with the entity_instance class.
     * If an IFC type class has subclasses, all entities of those subclasses are also returned.
     * @modelID ID of the IFC model.
     * @entityClass IFC Class name.
     */
    async byType(modelID: number, entityClass: string) {
        return this.utils.byType(modelID, entityClass);
    }

    /**
     * Returns the IFC objects filtered by IFC ID.
     * @modelID ID of the IFC model.
     * @id Express ID of the element.
     */
    async byId(modelID: number, id: number) {
        return this.utils.byId(modelID, id);
    }

    /**
     * Returns the IFC objects filtered by IFC Type and wrapped with the entity_instance class.
     * If an IFC type class has subclasses, all entities of those subclasses are also returned.
     * @modelID ID of the IFC model.
     * @entityClass IFC Class name.
     */
    async idsByType(modelID: number, entityClass: string) {
        return this.utils.idsByType(modelID, entityClass);
    }

    // MISC - Miscelaneus logic for various purposes

    /**
     * Disposes all memory used by the IFCLoader, including WASM memory and the web worker.
     * Use this if you want to destroy the object completely.
     * If you want to load an IFC later, you'll need to create a new instance.
     */
    async dispose() {
        IFCModel.dispose();
        await this.cleaner.dispose();
        this.subsets.dispose();
        (this.state as any) = null;
    }

    /**
     * For internal use of IFC.js dev team and testers
     */
    getAndClearErrors(modelID: number) {
        return this.parser.getAndClearErrors(modelID);
    }
}
