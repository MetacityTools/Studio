import React from 'react';
import { TbLayersSubtract } from 'react-icons/tb';

import { deleteSubmodels } from '@utils/utils';
import { useScene, useSelection } from '@utils/utils';

import { useProcessing } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function DeleteSubmodelsWidget() {
    const scene = useScene();
    const [, selectedModel, selectedSubmodels] = useSelection();
    const [, setProcessing] = useProcessing();

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        await deleteSubmodels(scene, selectedModel, selectedSubmodels);
        setProcessing(false);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersSubtract className="mr-2" />
                    Delete Submodels
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Remove the selected submodels from the model.</WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
