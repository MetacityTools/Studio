import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { SizeGuard } from '@elements/SizeGuard';

import { CanvasView } from './Canvas/CanvasView';
import { EditingStage, useEditingStage } from './Context/EditorContext';
import { SidePanel } from './SidePanel/SidePanel';
import { ProcessingScreen } from './Utils/Processing';
import { SpashScreen } from './Utils/Splash';

export function ModelEditor() {
    const [editingStage] = useEditingStage();
    const minSize = editingStage === EditingStage.Table ? 800 : 450;
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