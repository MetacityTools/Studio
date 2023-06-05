import React from 'react';

import { createGroup } from '@utils/utils';

import { EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';

import { Button } from '@elements/Button';

export function HierarchyMenu() {
    const { selectedSubmodels } = React.useContext(EditorContext);
    const { graph, nodeToMove, setNodeToMove } = React.useContext(TablesContext);

    const group = () => {
        createGroup(selectedSubmodels, graph);
    };

    const unmove = () => {
        setNodeToMove(undefined);
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <Button onClick={group}>Group Selected Models</Button>
            <Button onClick={unmove} disabled={!nodeToMove}>
                Unmove
            </Button>
        </div>
    );
}
