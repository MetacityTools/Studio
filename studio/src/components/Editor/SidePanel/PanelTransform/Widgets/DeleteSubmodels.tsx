import React from 'react';
import { TbLayersSubtract } from 'react-icons/tb';

import { deleteSubmodels } from '@utils/transforms/deleteSubmodels';

import { EditorContext } from '@editor/Context';

import { DetailWidget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function DeleteSubmodelsWidget() {
    const ctx = React.useContext(EditorContext);
    const { setProcessing, scene, selectedModel, selectedSubmodels } = ctx;

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        await deleteSubmodels(scene, selectedModel, selectedSubmodels);
        setProcessing(false);
    };

    return (
        <DetailWidget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersSubtract className="mr-2" />
                    Delete Submodels
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Remove the selected submodels from the model.</WidgetDescription>
            </WidgetLine>
        </DetailWidget>
    );
}
