import { UserInputModel } from 'types';
import { IfcAPI, Vector } from 'web-ifc/web-ifc-api';

class IFCLoader {
    readonly data: { [item: number]: any } = {};
    private api = new IfcAPI();
    constructor() {
        this.api.SetWasmPath('/', true);
    }

    async loadIFC(name: string, buffer: ArrayBuffer) {
        await this.api.Init();
        console.log(this.api);

        const bufferui8 = new Uint8Array(buffer);
        console.log(`Loading IFC model ${name} with size ${bufferui8.length}`);
        const modelID = this.api.OpenModel(bufferui8);
        console.log(`Loading model ID: ${modelID}`);
        const lines = this.api.GetAllLines(modelID);
        this.getAllItemsFromLines(modelID, lines);
    }

    private getAllItemsFromLines(modelID: number, lines: Vector<number>) {
        for (let i = 0; i < lines.size(); i++) {
            try {
                this.saveProperties(modelID, lines, i);
            } catch (e) {
                console.error(`Error loading item ID: ${lines.get(i)}`);
                console.error(e);
            }
        }
    }

    private saveProperties(modelID: number, lines: Vector<number>, index: number) {
        const itemID = lines.get(index);
        const props = this.api.GetLine(modelID, itemID);
        props.type = props.__proto__.constructor.name;
        this.data[itemID] = props;
    }
}

export function parseIFC(models: UserInputModel[]) {
    console.log(`Loading ${models.length} models`);
    models.forEach(async (model) => {
        if (model.name.endsWith('.ifc')) {
            console.log(`Loading IFC model ${model.name}`);
            const ifcLoader = new IFCLoader();
            await ifcLoader.loadIFC(model.name, model.buffer);
            console.log(ifcLoader.data);
        }
    });
}

self.onmessage = (e) => {
    parseIFC(e.data);
};
