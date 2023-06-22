import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { Hierarchy } from './Hierarchy/Hierarchy';
import { MetaEditor } from './MetaEditor';
import { MetadataMenu } from './MetadataMenu';

export function MetadataSidePanel() {
    return (
        <div className="w-full h-full flex flex-col">
            <MetadataMenu />
            <div className="flex-1">
                <Allotment separator={false}>
                    <Allotment.Pane preferredSize={400} minSize={300}>
                        <Hierarchy />
                    </Allotment.Pane>
                    <Allotment.Pane
                        preferredSize={800}
                        className="flex flex-col border-l border-neutral-200"
                    >
                        <MetaEditor />
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}
