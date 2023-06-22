import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasComponent } from './Canvas/CanvasComponent';
import { Controls } from './Canvas/Controls';
import { Help } from './Canvas/Help';
import { EditorSpash } from './EditorSplash';
import { SidePanel } from './SidePanel/SidePanel';

export function ModelEditor() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <div className="w-full h-full">
                <Allotment separator={false}>
                    <Allotment.Pane minSize={200} className="bg-neutral-100">
                        <CanvasComponent />
                        <Help />
                        <Controls />
                    </Allotment.Pane>
                    <Allotment.Pane
                        minSize={500}
                        preferredSize={500}
                        className="border-l border-neutral-200"
                    >
                        <SidePanel />
                    </Allotment.Pane>
                </Allotment>
            </div>
            <ProcessingScreen />
            <EditorSpash />
        </SizeGuard>
    );
}
