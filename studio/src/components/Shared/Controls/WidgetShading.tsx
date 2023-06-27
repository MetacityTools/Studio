import { MdHeight } from 'react-icons/md';

import { Range } from '@elements/Range';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { useScene, useShadeRange } from '@shared/Context/hooks';

export function ShadingWidget() {
    const scene = useScene();
    const [minShade, maxShade, setMinShade, setMaxShade] = useShadeRange();

    const updateMinShade = (value: number) => {
        if (isNaN(value)) return;
        setMinShade(value);
    };

    const updateMaxShade = (value: number) => {
        if (isNaN(value)) return;
        setMaxShade(value);
    };

    return (
        <Widget>
            <WidgetLine>
                <WidgetTitle>
                    <MdHeight className="mr-2" />
                    Height Shading
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Set Z-levels for shading</WidgetDescription>
            </WidgetLine>
            <WidgetLine className="py-2 px-4">Low Z is {minShade.toFixed(2)}</WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Range min={-10} max={500} value={minShade} onChange={updateMinShade} />
            </WidgetLine>
            <WidgetLine className="py-2 px-4">High Z is {maxShade.toFixed(2)}</WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Range min={-10} max={500} value={maxShade} onChange={updateMaxShade} />
            </WidgetLine>
        </Widget>
    );
}
