import React from 'react';

import { useGraph, useSelectedModels } from '@utils/utils';

import { HierarchyMenu } from '../Menu/HierarchyMenu';
import { GroupNode } from './NodeGroup';

export function Hierarchy() {
    const [graph] = useGraph();
    const selectedModels = useSelectedModels();

    return (
        <div className="flex flex-col w-full h-full">
            <HierarchyMenu />
            <div className="flex flex-col flex-grow overflow-y-auto p-4 px-4">
                <GroupNode node={graph.root} selectedModels={selectedModels} />
            </div>
        </div>
    );
}
