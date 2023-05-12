import { CameraGroundWidget } from './Widgets/CameraGround';
import { ShadingWidget } from './Widgets/Shading';
import { ShowGridWidget } from './Widgets/ShowGrid';

export function ViewSettings() {
    return (
        <div className="p-4 space-y-4">
            <ShadingWidget />
            <CameraGroundWidget />
            <ShowGridWidget />
        </div>
    );
}
