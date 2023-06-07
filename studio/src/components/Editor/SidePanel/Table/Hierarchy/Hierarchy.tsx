import React from 'react';

import { EditorModel } from '@utils/utils';
import { useModels, useSelectedSubmodels } from '@utils/utils';

import { useGraph } from '@editor/Context/TableContext';

import { HierarchyMenu } from '../Menu/HierarchyMenu';
import { GroupNode } from './NodeGroup';

export function Hierarchy() {
    const models = useModels();
    const [selectedSubmodels] = useSelectedSubmodels();
    const [graph] = useGraph();

    const mainModel = models.filter((model) => model instanceof EditorModel)[0];
    const submodels = React.useMemo(() => new Set(selectedSubmodels), [selectedSubmodels]);

    return (
        <div className="flex flex-col w-full h-full">
            <HierarchyMenu />
            <div className="flex flex-col flex-grow overflow-y-auto p-4 px-4">
                <GroupNode model={mainModel} submodels={submodels} node={graph.root} />
            </div>
        </div>
    );
}
