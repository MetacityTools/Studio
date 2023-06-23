import { useGraph, useSelectedModels } from '@shared/Context/hooks';

import { GroupNode } from './NodeGroup';

export function GroupHierarchy() {
    const [graph] = useGraph();
    const selectedModels = useSelectedModels();

    return <GroupNode node={graph.root} selectedModels={selectedModels} />;
}
