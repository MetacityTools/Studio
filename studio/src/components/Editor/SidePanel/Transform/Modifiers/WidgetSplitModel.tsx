import React from 'react';
import { TbLayersIntersect } from 'react-icons/tb';

import { splitModel } from '@utils/utils';

import { EditorContext } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function SplitModelWidget() {
    const { setProcessing, scene, selectedModel, selectedSubmodels } =
        React.useContext(EditorContext);

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
