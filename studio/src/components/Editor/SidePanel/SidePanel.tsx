import 'allotment/dist/style.css';
import React from 'react';

import { EditingStage, useEditingStage } from '@editor/Context/EditorContext';

import { TableSidePanel } from './Table/TableSidePanel';
import { TransformSidePanel } from './Transform/TransformSidePanel';

export function SidePanel() {
    const [editingStage] = useEditingStage();

    return (
        <div className="w-full h-full flex flex-col items-start shadow-even rounded-lg bg-white">
            {editingStage === EditingStage.Transform && <TransformSidePanel />}
            {editingStage === EditingStage.Table && <TableSidePanel />}
        </div>
    );
}
