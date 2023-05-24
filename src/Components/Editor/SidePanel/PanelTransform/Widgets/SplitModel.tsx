import React from 'react';
import { TbLayersIntersect } from 'react-icons/tb';

import { splitModel } from '@utils/transforms/modelSplit';

import { EditorContext } from '@components/Editor/Context';

import {
    DetailWidget,
    WidgetApplyButton,
    WidgetDescription,
    WidgetLine,
    WidgetTitle,
} from '@elements/Widgets';

export function SplitModelWidget() {
    const ctx = React.useContext(EditorContext);
    const { setProcessing, scene, selectedModel, selectedSubmodels } = ctx;

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        await splitModel(scene, selectedModel, selectedSubmodels);
        setProcessing(false);
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersIntersect className="mr-2" />
                    Split Model
                </WidgetTitle>
                <WidgetApplyButton onApply={apply} />
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Split the model based on the current selection, the selected parts will be
                    removed from the original model and placed into a new model.
                </WidgetDescription>
            </WidgetLine>
        </DetailWidget>
    );
}
