import { ModelGraph } from '@utils/hierarchy/graph';

export function createHierarchy(submodelCount: number, metdata: { [key: string]: any }[]) {
    const hierarchy = new ModelGraph();
    for (let i = 0; i < submodelCount; i++) hierarchy.addModelToRoot(i, metdata[i]);
    return hierarchy;
}
