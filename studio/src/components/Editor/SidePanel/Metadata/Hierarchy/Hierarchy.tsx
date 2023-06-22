import { useGraph, useSelectedModels } from '@utils/utils';

import { GroupNode } from './NodeGroup';

export function Hierarchy() {
    const [graph] = useGraph();
    const selectedModels = useSelectedModels();

    return (
        <div className="flex flex-col w-full h-full">
            <div className="overflow-y-auto p-4">
                <GroupNode node={graph.root} selectedModels={selectedModels} />
            </div>
        </div>
    );
}
