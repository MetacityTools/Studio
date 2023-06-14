import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { useLoadingStatus, useProcessing } from '@elements/Context';
import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasView } from './Canvas/CanvasView';
import { EditingMode, useEditingMode } from './Context/EditorContext';
import { SidePanel } from './SidePanel/SidePanel';
import { SpashScreen } from './Utils/Splash';

export function ModelEditor() {
    const [editingMode] = useEditingMode();
    const minSize = editingMode === EditingMode.Table ? 800 : 450;

    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane minSize={200} className="bg-neutral-100">
                    <CanvasView />
                </Allotment.Pane>
                <Allotment.Pane
                    minSize={minSize}
                    preferredSize={minSize}
                    className="bg-neutral-100 border-l border-neutral-200"
                >
                    <SidePanel />
                </Allotment.Pane>
            </Allotment>
            <ProcessingScreen />
            <SpashScreen />
        </SizeGuard>
    );
}
