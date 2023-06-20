import { ProcessingScreen } from '@elements/Processing';

import { CanvasView } from './CanvasView';
import { Menu } from './Menu';
import { MetadataHierarchy } from './Metadata/Hierarchy';
import { SpashScreen } from './Splash';

export function ModelViewer() {
    return (
        <div className="w-full h-full">
            <CanvasView />
            <Menu />
            <MetadataHierarchy />
            <SpashScreen />
            <ProcessingScreen />
        </div>
    );
}
