import { ModelHierarchy, ModelHierarchyGroup } from '@utils/types';

export function createFlatHierarchy(data: { [data: number]: any }): ModelHierarchy {
    const root: ModelHierarchyGroup = {
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
