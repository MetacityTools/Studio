import { IfcState } from '../BaseDefinitions';

/**
 * Contains the logic to manage the type (e. g. IfcWall, IfcWindow, IfcDoor) of
 * all the items within an IFC file.
 */
export class TypeManager {
    constructor(private state: IfcState) {
        this.state = state;
    }

    async getAllTypes() {
        for (let modelID in this.state.models) {
            if (this.state.models.hasOwnProperty(modelID)) {
                const types = this.state.models[modelID].types;
                if (Object.keys(types).length == 0) {
                    await this.getAllTypesOfModel(parseInt(modelID));
                }
            }
        }
    }

    async getAllTypesOfModel(modelID: number) {
        const result = {};
        const elements = await this.state.api.GetIfcEntityList(modelID);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const lines = await this.state.api.GetLineIDsWithType(modelID, element);
            const size = lines.size();
            //@ts-ignore
            for (let i = 0; i < size; i++) result[lines.get(i)] = element;
        }
        this.state.models[modelID].types = result;
    }
}
