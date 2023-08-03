import { useCameraZ } from '@hooks/hooks';
import { TbCircuitGround } from 'react-icons/tb';

import { Range } from '@elements/Range';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function CameraGroundWidget() {
    const [camTargetZ, setCamTargetZ] = useCameraZ();

    const updateCamTargetZ = (value: number) => {
        if (isNaN(value)) return;
        setCamTargetZ(value);
    };

    return (
        <Widget>
            <WidgetLine>
                <WidgetTitle>
                    <TbCircuitGround className="mr-2" />
                    Camera Ground Level
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Set Ground Level for the camera</WidgetDescription>
            </WidgetLine>
            <WidgetLine className="py-2 px-4">
                Camera ground is at {camTargetZ.toFixed(2)}
            </WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Range min={-1000} max={1000} value={camTargetZ} onChange={updateCamTargetZ} />
            </WidgetLine>
        </Widget>
    );
}
