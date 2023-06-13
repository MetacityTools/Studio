import React from 'react';

import { createGroup, useGraph, useSelectedModels } from '@utils/utils';

import { useMovingNode } from '@editor/Context/TableContext';

import { Button } from '@elements/Button';

export function HierarchyMenu() {
    const selection = useSelectedModels();
    const [graph] = useGraph();
    const [nodeToMove, updateNodeToMove] = useMovingNode();

    const group = () => {
        createGroup(selection, graph);
    };

    const unmove = () => {
        updateNodeToMove(undefined);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <Button onClick={group}>Group Selected Models</Button>
            <Button onClick={unmove} disabled={!nodeToMove}>
                End Move
            </Button>
        </div>
    );
}
