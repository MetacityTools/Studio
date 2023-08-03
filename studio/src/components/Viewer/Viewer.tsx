import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { SizeGuard } from '@elements/SizeGuard';

import { AutoLoader } from '@shared/AutoLoader';
import { CanvasWrapper } from '@shared/CanvasWrapper';
import { Controls } from '@shared/Controls';
import { StatusBar } from '@shared/StatusBar';
import { TooltipOverlay } from '@shared/Tooltip';

import { SidePanel } from './SidePanel';
import { ViewerSplash } from './ViewerSplash';

export function ModelViewer() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <div className="flex flex-col w-screen h-screen">
                <div className="flex-1 w-full h-full">
                    <Allotment separator={false}>
                        <Allotment.Pane
                            className="border-r mc-border mc-background"
                            preferredSize={400}
                        >
                            <SidePanel />
                        </Allotment.Pane>
                        <Allotment.Pane className="relative">
                            <CanvasWrapper />
                            <Controls />
                            <TooltipOverlay />
                        </Allotment.Pane>
                    </Allotment>
                </div>
                <StatusBar />
                <ViewerSplash />
                <AutoLoader />
            </div>
        </SizeGuard>
    );
}
