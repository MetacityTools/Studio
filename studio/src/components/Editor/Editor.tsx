import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { SizeGuard } from '@elements/SizeGuard';

import { CanvasWrapper } from './Canvas/CanvasWrapper';
import { ContextComponent, HierarchyContextComponent, ViewContextComponent } from './Context';
import { SidePanel } from './SidePanel/SidePanel';
import { ProcessingScreen } from './Utils/Processing';
import { SpashScreen } from './Utils/Splash';
import { HelpPanel } from './ViewControls/Help';
import { ViewControls } from './ViewControls/ViewControls';

export function ModelEditor() {
    return (
        <ContextComponent>
            <ViewContextComponent>
                <HierarchyContextComponent>
                    <SizeGuard minWidth={600} minHeight={400}>
                        <Allotment separator={false}>
                            <Allotment.Pane minSize={200} className="bg-neutral-100">
                                <ViewControls />
                                <CanvasWrapper />
                                <HelpPanel />
                            </Allotment.Pane>
                            <Allotment.Pane
                                minSize={200}
                                preferredSize={400}
                                className="bg-neutral-100"
                            >
                                <SidePanel />
                            </Allotment.Pane>
                        </Allotment>
                    </SizeGuard>
                    <ProcessingScreen />
                    <SpashScreen />
                </HierarchyContextComponent>
            </ViewContextComponent>
        </ContextComponent>
    );
}
