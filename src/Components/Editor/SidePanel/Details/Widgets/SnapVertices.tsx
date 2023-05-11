import React from 'react';
import { TbRulerMeasure } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';
import { snapVertices } from '@utils/transforms/vertexSnap';

import * as GL from '@bananagl/bananagl';

import {
    DetailWidget,
    WidgetApplyButton,
    WidgetDescription,
    WidgetLine,
    WidgetTitle,
} from '@elements/Widgets';

interface SnapVerticesProps {
    model: EditorModel;
}

export function SnapVerticesWidget(props: SnapVerticesProps) {
    const { model } = props;

    const [snapDistance, setSnapDistance] = React.useState(0.1);

    const updateSnapValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const i = parseFloat(e.target.value);
        if (isNaN(i)) return;
        else setSnapDistance(i);
    };

    const applySnap = () => {
        snapVertices(model, snapDistance);
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <TbRulerMeasure className="mr-2" />
                    Snap Vertices
                </WidgetTitle>
                <WidgetApplyButton onApply={applySnap} />
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Snap vertices that are within the specified distance to each other.
                </WidgetDescription>
            </WidgetLine>
            <WidgetLine>
                <div className="py-2 px-4">Distance</div>
                <input
                    type="number"
                    className="py-2 px-4 text-right flex-1 rounded-br-md"
                    step={0.1}
                    defaultValue={snapDistance}
                    onChange={updateSnapValue}
                />
            </WidgetLine>
        </DetailWidget>
    );
}
