import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasComponent } from '@shared/CanvasComponent';
import { Controls } from '@shared/Controls';
import { StyleDetailPanel } from '@shared/StyleDetail';

import { SidePanel } from './SidePanel';
import { ViewerSplash } from './ViewerSplash';

export function ModelViewer() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane className="border-r" minSize={300}>
                    <SidePanel />
                </Allotment.Pane>
                <Allotment.Pane preferredSize={1200} className="relative">
                    <CanvasComponent />
                    <Controls />
                    <StyleDetailPanel className="absolute left-0 bottom-0 m-4" />
                </Allotment.Pane>
            </Allotment>
            <ProcessingScreen />
            <ViewerSplash />
        </SizeGuard>
    );
}
