import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { SizeGuard } from '@elements/SizeGuard';

import { CanvasWrapper } from './Canvas/CanvasWrapper';
import {
    ContextComponent,
    EditingStage,
    EditorContext,
    HierarchyContextComponent,
    ViewContextComponent,
} from './Context';
import { SidePanel } from './SidePanel/SidePanel';
import { ProcessingScreen } from './Utils/Processing';
import { SpashScreen } from './Utils/Splash';
import { HelpPanel } from './ViewControls/Help';
import { ViewControls } from './ViewControls/ViewControls';

export function ModelEditor() {
    const ctx = React.useContext(EditorContext);
    const { editingStage } = ctx;
    const minSize = editingStage === EditingStage.Annotate ? 800 : 400;
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane minSize={200} className="bg-neutral-100">
                    <ViewControls />
                    <CanvasWrapper />
                    <HelpPanel />
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
