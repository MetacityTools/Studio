import React from 'react';
import { TbRulerMeasure } from 'react-icons/tb';

import { snapVertices } from '@utils/modifiers/vertexSnap';

import { EditorContext } from '@editor/Context/EditorContext';

import { Input } from '@elements/Input';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function SnapVerticesWidget() {
    const [snapDistance, setSnapDistance] = React.useState(0.1);
    const { selectedModel } = React.useContext(EditorContext);

    if (selectedModel === null) return null;

    const updateSnapValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const i = parseFloat(e.target.value);
        if (isNaN(i)) return;
        else setSnapDistance(i);
    };

    const applySnap = () => {
        snapVertices(selectedModel, snapDistance);
    };

    return (
        <Widget onClick={applySnap}>
            <WidgetLine>
                <WidgetTitle>
                    <TbRulerMeasure className="mr-2" />
                    Collapse Vertices
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Collapse vertices that are within the specified distance to each other.
                </WidgetDescription>
            </WidgetLine>
            <WidgetLine>
                <div className="py-2 px-4">Distance</div>
                <Input
                    type="number"
                    className="py-2 px-4 text-right w-full rounded-br-md"
                    step={0.1}
                    defaultValue={snapDistance}
                    onChange={updateSnapValue}
                />
            </WidgetLine>
        </Widget>
    );
}
