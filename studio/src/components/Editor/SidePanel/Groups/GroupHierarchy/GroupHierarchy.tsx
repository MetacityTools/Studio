import { useGraph, useSelectedModels } from '@utils/utils';

import { GroupNode } from './NodeGroup';

export function GroupHierarchy() {
    const [graph] = useGraph();
    const selectedModels = useSelectedModels();

    return <GroupNode node={graph.root} selectedModels={selectedModels} />;
}
