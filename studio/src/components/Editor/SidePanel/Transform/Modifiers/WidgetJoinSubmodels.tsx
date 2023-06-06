import React from 'react';
import { TbLayersUnion } from 'react-icons/tb';

import { joinSubmodels } from '@utils/utils';
import { useScene, useSelection } from '@utils/utils';

import { useProcessing } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function JoinSubmodelWidget() {
    const scene = useScene();
    const [select, selectedModel, selectedSubmodels] = useSelection();
    const [, setProcessing] = useProcessing();

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        const joinedSubmodelIDs = await joinSubmodels(selectedModel, selectedSubmodels);
        select(selectedModel, joinedSubmodelIDs);
        setProcessing(false);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersUnion className="mr-2" />
                    Join Submodels
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Join selected submodels into a single submodel.
                </WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
