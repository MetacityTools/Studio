import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { SizeGuard } from '@elements/SizeGuard';

import { AutoLoader } from '@shared/AutoLoader';
import { CanvasWrapper } from '@shared/CanvasWrapper';
import { Controls } from '@shared/Controls';
import { StatusBar } from '@shared/StatusBar';
import { TooltipOverlay } from '@shared/Tooltip';

import { EditorSpash } from './EditorSplash';
import { SidePanel } from './SidePanel';

export function ModelEditor() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <div className="flex flex-col w-screen h-screen">
                <div className="flex-1 w-full h-full">
                    <Allotment separator={false}>
                        <Allotment.Pane
                            preferredSize={500}
                            snap
                            className="border-r mc-border mc-background"
                        >
                            <SidePanel />
                        </Allotment.Pane>
                        <Allotment.Pane minSize={200} className="bg-neutral-100">
                            <CanvasWrapper />
                            <Controls />
                            <TooltipOverlay />
                        </Allotment.Pane>
                    </Allotment>
                </div>
                <StatusBar />
                <EditorSpash />
                <AutoLoader />
            </div>
        </SizeGuard>
    );
}
