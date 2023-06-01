import React from 'react';
import { TbLayersUnion } from 'react-icons/tb';

import { joinModel } from '@utils/transforms/joinSubmodels';

import { EditorContext } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function JoinSubmodelWidget() {
    const { setProcessing, selectedModel, selectedSubmodels, select } =
        React.useContext(EditorContext);

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        const joinedSubmodelIDs = await joinModel(selectedModel, selectedSubmodels);
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
