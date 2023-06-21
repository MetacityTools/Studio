import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import { ProcessingScreen } from '@elements/Processing';
import { SizeGuard } from '@elements/SizeGuard';

import { CanvasView } from './CanvasView';
import { Menu } from './Menu';
import { MetadataHierarchy } from './Metadata/Metadata';
import { SpashScreen } from './Splash';

export function ModelViewer() {
    return (
        <SizeGuard minWidth={600} minHeight={400}>
            <Allotment separator={false}>
                <Allotment.Pane className="border-r border-neutral-200" preferredSize={300}>
                    <MetadataHierarchy />
                </Allotment.Pane>
                <Allotment.Pane>
                    <CanvasView />
                    <Menu />
                </Allotment.Pane>
            </Allotment>
            <ProcessingScreen />
            <SpashScreen />
        </SizeGuard>
    );
}
