import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasView } from './Canvas/CanvasView';
import { SidePanel } from './SidePanel/SidePanel';
import { SpashScreen } from './Utils/Splash';

export function ModelEditor() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <div className="w-full h-full">
                <Allotment separator={false}>
                    <Allotment.Pane minSize={200} className="bg-neutral-100">
                        <CanvasView />
                    </Allotment.Pane>
                    <Allotment.Pane
                        minSize={450}
                        preferredSize={450}
                        className="border-l border-neutral-200"
                    >
                        <SidePanel />
                    </Allotment.Pane>
                </Allotment>
            </div>
            <ProcessingScreen />
            <SpashScreen />
        </SizeGuard>
    );
}
