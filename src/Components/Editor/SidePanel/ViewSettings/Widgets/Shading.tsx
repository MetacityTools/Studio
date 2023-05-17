import React from 'react';
import { MdHeight } from 'react-icons/md';

import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@components/Editor/Utils/Context';

import { Range } from '@elements/Range';
import { DetailWidget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function ShadingWidget() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { scene, minShade, setMinShade, maxShade, setMaxShade } = ctx;

    const updateMinShade = (value: number) => {
        if (isNaN(value)) return;
        scene.objects.forEach((object) => {
            if (object instanceof EditorModel) {
                object.uniforms = {
                    uZMin: value,
                };
            }
        });

        setMinShade(value);
    };

    const updateMaxShade = (value: number) => {
        if (isNaN(value)) return;
        scene.objects.forEach((object) => {
            if (object instanceof EditorModel) {
                object.uniforms = {
                    uZMax: value,
                };
            }
        });

        setMaxShade(value);
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <MdHeight className="mr-2" />
                    Height Shading
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Set Z-levels for shading</WidgetDescription>
            </WidgetLine>
            <WidgetLine className="py-2 px-4">Low Z is {minShade}</WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Range min={-10} max={500} value={minShade} onChange={updateMinShade} />
            </WidgetLine>
            <WidgetLine className="py-2 px-4">High Z is {maxShade}</WidgetLine>
            <WidgetLine className="px-4 mb-4">
                <Range min={-10} max={500} value={maxShade} onChange={updateMaxShade} />
            </WidgetLine>
        </DetailWidget>
    );
}
