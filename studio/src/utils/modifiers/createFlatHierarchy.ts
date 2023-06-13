import { ModelHierarchy, ModelHierarchyGroupNode } from '@utils/types';

export function createFlatHierarchy(data: { [data: number]: any }): ModelHierarchy {
    const root: ModelHierarchyGroupNode = {
        children: [],
        data: {},
    };

    for (const id in data) {
        const metadata = data[id];
        const group = {
            id: Number(id),
            data: metadata,
        };
        root.children.push(group);
    }

    return {
        root,
    };
}
