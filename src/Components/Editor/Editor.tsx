import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { SizeGuard } from '@elements/SizeGuard';

import { Canvas } from './Canvas';
import { ContextComponent } from './Context';
import { ProcessingScreen } from './Processing';
import { SidePanel } from './SidePanel';
import { ViewControls } from './ViewControls';

export function ModelEditor() {
    return (
        <ContextComponent>
            <SizeGuard minWidth={600} minHeight={400}>
                <Allotment separator={false}>
                    <Allotment.Pane minSize={200}>
                        <ViewControls />
                        <Canvas />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={200} preferredSize={400} className="bg-neutral-100/25">
                        <SidePanel />
                    </Allotment.Pane>
                </Allotment>
            </SizeGuard>
            <ProcessingScreen />
        </ContextComponent>
    );
}
