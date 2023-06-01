import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { HierarchyPanel } from './Hierarchy/HierarchyPanel';
import { TableMenu } from './Menu/TableMenu';

export function TableSidePanel() {
    return (
        <>
            <TableMenu />
            <div className="h-full w-full">
                <Allotment separator={false}>
                    <Allotment.Pane minSize={200} preferredSize={300}>
                        <HierarchyPanel />
                    </Allotment.Pane>
                    <Allotment.Pane
                        minSize={400}
                        className="flex flex-col border-l border-neutral-200"
                    >
                        {null}
                    </Allotment.Pane>
                </Allotment>
            </div>
        </>
    );
}
