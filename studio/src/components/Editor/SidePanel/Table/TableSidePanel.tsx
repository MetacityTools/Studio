import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { Hierarchy } from './Hierarchy/Hierarchy';
import { Meta } from './Meta/Meta';

export function TableSidePanel() {
    return (
        <div className="h-full w-full">
            <Allotment separator={false}>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <Hierarchy />
                </Allotment.Pane>
                <Allotment.Pane minSize={400} className="flex flex-col border-l border-neutral-200">
                    <Meta />
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
