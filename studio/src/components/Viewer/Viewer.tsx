import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { IOMenu } from '@elements/IOMenu/IOMenu';
import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasView } from './Canvas/CanvasView';
import { Controls } from './Canvas/Controls';
import { MetadataHierarchy } from './SidePanel/Metadata';
import { ViewerSplash } from './ViewerSplash';

export function ModelViewer() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane className="border-r border-neutral-200 flex flex-col" minSize={300}>
                    <IOMenu />
                    <MetadataHierarchy />
                </Allotment.Pane>
                <Allotment.Pane preferredSize={1200}>
                    <CanvasView />
                    <Controls />
                </Allotment.Pane>
            </Allotment>
            <ProcessingScreen />
            <ViewerSplash />
        </SizeGuard>
    );
}
