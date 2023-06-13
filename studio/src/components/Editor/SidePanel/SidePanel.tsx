import 'allotment/dist/style.css';

import { EditingMode, useEditingMode } from '@editor/Context/EditorContext';

import { TableSidePanel } from './Table/TableSidePanel';
import { TransformSidePanel } from './Transform/TransformSidePanel';

export function SidePanel() {
    const [editingMode] = useEditingMode();

    return (
        <div className="w-full h-full flex flex-col items-start shadow-even bg-white">
            {editingMode === EditingMode.Transform && <TransformSidePanel />}
            {editingMode === EditingMode.Table && <TableSidePanel />}
        </div>
    );
}
