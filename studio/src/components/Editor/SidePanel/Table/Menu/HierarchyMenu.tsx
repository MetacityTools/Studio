import React from 'react';

import { createGroup } from '@utils/utils';
import { useSelectedSubmodels } from '@utils/utils';

import { useGraph, useMovingNode } from '@editor/Context/TableContext';

import { Button } from '@elements/Button';

export function HierarchyMenu() {
    const [selectedSubmodels] = useSelectedSubmodels();
    const [graph] = useGraph();
    const [nodeToMove, updateNodeToMove] = useMovingNode();

    const group = () => {
        createGroup(selectedSubmodels, graph);
    };

    const unmove = () => {
        updateNodeToMove(undefined);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <Button onClick={group}>Group Selected Models</Button>
            <Button onClick={unmove} disabled={!nodeToMove}>
                Drop Moving
            </Button>
        </div>
    );
}
