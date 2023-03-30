import { IfcState, SubsetConfig } from '../../BaseDefinitions';
import { MaterialData, ModelData } from '../Data';
import { ItemsMap } from './ItemsMap';
import { SubsetCreator } from './SubsetCreator';

export interface Subset extends ModelData {
    modelID: number;
}

export type Subsets = {
    [subsetID: string]: { ids: Set<number>; mesh: Subset; bvh: boolean };
};

/**
 * Contains the logic to get, create and delete geometric subsets of an IFC model. For example,
 * this can extract all the items in a specific IfcBuildingStorey and create a new Mesh.
 */
export class SubsetManager {
    readonly items: ItemsMap;
    private state: IfcState;
    private subsets: Subsets = {};
    private subsetCreator: SubsetCreator;

    constructor(state: IfcState) {
        this.state = state;
        this.items = new ItemsMap(state);
        this.subsetCreator = new SubsetCreator(state, this.items, this.subsets);
    }

    getAllSubsets() {
        return this.subsets;
    }

    getSubset(modelID: number, material?: MaterialData, customId?: string) {
        const subsetID = this.getSubsetID(modelID, material, customId);
        return this.subsets[subsetID].mesh;
    }

    removeSubset(modelID: number, material?: MaterialData, customID?: string) {
        const subsetID = this.getSubsetID(modelID, material, customID);
        const subset = this.subsets[subsetID];
        if (!subset) return;
        if (subset.mesh.parent) subset.mesh.removeFromParent();
        subset.mesh.geometry.dispose();
        // @ts-ignore
        subset.mesh.geometry = null;
        delete this.subsets[subsetID];
    }

    createSubset(config: SubsetConfig) {
        const subsetID = this.getSubsetID(config.modelID, config.material, config.customID);
        return this.subsetCreator.createSubset(config, subsetID);
    }

    removeFromSubset(modelID: number, ids: number[], customID?: string, material?: MaterialData) {
        const subsetID = this.getSubsetID(modelID, material, customID);
        if (!this.subsets[subsetID]) return;

        const previousIDs = this.subsets[subsetID].ids;
        ids.forEach((id) => {
            if (previousIDs.has(id)) previousIDs.delete(id);
        });

        return this.createSubset({
            modelID,
            removePrevious: true,
            material,
            customID,
            applyBVH: this.subsets[subsetID].bvh,
            ids: Array.from(previousIDs),
            parent: this.subsets[subsetID].mesh.parent as ModelData,
        });
    }

    clearSubset(modelID: number, customID?: string, material?: MaterialData) {
        const subsetID = this.getSubsetID(modelID, material, customID);
        if (!this.subsets[subsetID]) return;
        this.subsets[subsetID].ids.clear();
        const subset = this.getSubset(modelID, material, customID);
        subset.geometry.setIndex([]);
    }

    // Use this only for destroying the current IFCLoader instance
    dispose() {
        this.items.dispose();
        this.subsetCreator.dispose();

        Object.values(this.subsets).forEach((subset) => {
            (subset.ids as any) = null;
            subset.mesh.removeFromParent();
            subset.mesh.geometry.dispose();
            const geom = subset.mesh.geometry as any;
            if (geom.disposeBoundsTree) geom.disposeBoundsTree();
            (subset.mesh as any) = null;
        });
        (this.subsets as any) = null;
    }

    private getSubsetID(modelID: number, material?: MaterialData, customID = 'DEFAULT') {
        const baseID = modelID;
        const materialID = material ? material.uuid : 'DEFAULT';
        return `${baseID} - ${materialID} - ${customID}`;
    }
}
