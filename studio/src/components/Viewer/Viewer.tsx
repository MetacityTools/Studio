import { CanvasView } from './Canvas/CanvasView';
import { Menu } from './Menu/Menu';
import { SpashScreen } from './Utils/Splash';

export function ModelViewer() {
    return (
        <div className="w-full h-full">
            <CanvasView />
            <Menu />
            <SpashScreen />
        </div>
    );
}
