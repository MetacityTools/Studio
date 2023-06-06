import React from 'react';
import { TbLayersIntersect } from 'react-icons/tb';

import { splitModel } from '@utils/utils';
import { useScene, useSelection } from '@utils/utils';

import { useProcessing } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function SplitModelWidget() {
    const scene = useScene();
    const [, selectedModel, selectedSubmodels] = useSelection();
    const [, setProcessing] = useProcessing();

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        await splitModel(scene, selectedModel, selectedSubmodels);
        setProcessing(false);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersIntersect className="mr-2" />
                    Split Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Split the model based on the current selection, the selected parts will be
                    removed from the original model and placed into a new model.
                </WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
