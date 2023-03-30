import { IfcState, SubsetConfig } from '../../BaseDefinitions';
import { GeometryData, ModelData } from '../Data';
import { ItemsMap } from './ItemsMap';
import { Subset, Subsets } from './SubsetManager';
import { SubsetUtils } from './SubsetUtils';

export class SubsetCreator {
    private tempIndex: number[] = [];

    constructor(private state: IfcState, private items: ItemsMap, private subsets: Subsets) {}

    createSubset(config: SubsetConfig, subsetID: string) {
        if (!this.items.map[config.modelID]) this.items.generateGeometryIndexMap(config.modelID);
        if (!this.subsets[subsetID]) this.initializeSubset(config, subsetID);
        this.filterIndices(config, subsetID);
        this.constructSubsetByMaterial(config, subsetID);
        config.ids.forEach((id) => this.subsets[subsetID].ids.add(id));
        this.subsets[subsetID].mesh.geometry.setIndex(this.tempIndex);
        this.tempIndex.length = 0;
        const subset = this.subsets[subsetID].mesh;
        if (config.parent) config.parent.add(subset);
        return this.subsets[subsetID].mesh;
    }

    dispose() {
        this.tempIndex = [];
    }

    private initializeSubset(config: SubsetConfig, subsetID: string) {
        const model = this.state.models[config.modelID].mesh;
        const subsetGeom = new GeometryData();
        this.initializeSubsetAttributes(subsetGeom, model);
        if (!config.material) this.initializeSubsetGroups(subsetGeom, model);
        const mesh = new ModelData(subsetGeom, config.material || model.material) as Subset;
        mesh.modelID = config.modelID;
        const bvh = Boolean(config.applyBVH);
        this.subsets[subsetID] = { ids: new Set<number>(), mesh, bvh };
        model.add(mesh);
    }

    // The subset shares the same attributes as the original (no memory consumed)
    private initializeSubsetAttributes(subsetGeom: GeometryData, model: ModelData) {
        subsetGeom.position = model.geometry.position;
        subsetGeom.normal = model.geometry.normal;
        subsetGeom.expressID = model.geometry.expressID;
        subsetGeom.setIndex([]);
    }

    // If the subset has original materials, initialize the groups for the subset
    private initializeSubsetGroups(subsetGeom: GeometryData, model: ModelData) {
        subsetGeom.groups = JSON.parse(JSON.stringify(model.geometry.groups));
        this.resetGroups(subsetGeom);
    }

    // Remove previous indices or filter the given ones to avoid repeating items
    private filterIndices(config: SubsetConfig, subsetID: string) {
        const geometry = this.subsets[subsetID].mesh.geometry as GeometryData;
        if (config.removePrevious) {
            geometry.setIndex([]);
            this.resetGroups(geometry);
            return;
        }
        const previousIndices = geometry.index;
        const previousIDs = this.subsets[subsetID].ids;
        config.ids = config.ids.filter((id) => !previousIDs.has(id));
        this.tempIndex = Array.from(previousIndices);
    }

    private constructSubsetByMaterial(config: SubsetConfig, subsetID: string) {
        const model = this.state.models[config.modelID].mesh;
        const newIndices = { count: 0 };
        for (let i = 0; i < model.geometry.groups.length; i++) {
            this.insertNewIndices(config, subsetID, i, newIndices);
        }
    }

    // If this subset has original materials, insert indices in correct position and update groups
    // Otherwise, just insert indices at any position
    private insertNewIndices(
        config: SubsetConfig,
        subsetID: string,
        materialIndex: number,
        newIndices: any
    ) {
        const items = this.items.map[config.modelID];
        const indicesOfOneMaterial = SubsetUtils.getAllIndicesOfGroup(
            config.modelID,
            config.ids,
            materialIndex,
            items
        ) as number[];

        if (!config.material) {
            this.insertIndicesAtGroup(subsetID, indicesOfOneMaterial, materialIndex, newIndices);
        } else {
            indicesOfOneMaterial.forEach((index) => this.tempIndex.push(index));
        }
    }

    private insertIndicesAtGroup(
        subsetID: string,
        indicesByGroup: number[],
        index: number,
        newIndices: any
    ) {
        const currentGroup = this.getCurrentGroup(subsetID, index);
        currentGroup.start += newIndices.count;
        let newIndicesPosition = currentGroup.start + currentGroup.count;
        newIndices.count += indicesByGroup.length;
        if (indicesByGroup.length > 0) {
            let position = newIndicesPosition;
            const start = this.tempIndex.slice(0, position);
            const end = this.tempIndex.slice(position);
            this.tempIndex = Array.prototype.concat.apply([], [start, indicesByGroup, end]);
            currentGroup.count += indicesByGroup.length;
        }
    }

    private getCurrentGroup(subsetID: string, groupIndex: number) {
        const geometry = this.subsets[subsetID].mesh.geometry as GeometryData;
        return geometry.groups[groupIndex];
    }

    private resetGroups(geometry: GeometryData) {
        geometry.groups.forEach((group) => {
            group.start = 0;
            group.count = 0;
        });
    }
}
