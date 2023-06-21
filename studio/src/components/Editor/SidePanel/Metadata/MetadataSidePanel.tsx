import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { Hierarchy } from './Hierarchy/Hierarchy';
import { MetaEditor } from './MetaEditor';
import { MetadataMenu } from './MetadataMenu';

export function MetadataSidePanel() {
    return (
        <>
            <MetadataMenu />
            <Allotment separator={false}>
                <Allotment.Pane minSize={200} preferredSize={300}>
                    <Hierarchy />
                </Allotment.Pane>
                <Allotment.Pane minSize={400} className="flex flex-col border-l border-neutral-200">
                    <MetaEditor />
                </Allotment.Pane>
            </Allotment>
        </>
    );
}

//<TableMenu />
