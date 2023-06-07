import { Node } from './node';

export class ModelNode extends Node {
    constructor(public submodelId: number) {
        super();
    }

    selected(selectedModels: Set<number>) {
        return selectedModels.has(this.submodelId);
    }
}
