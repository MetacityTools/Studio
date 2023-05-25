import React from 'react';
import { TbLayersDifference } from 'react-icons/tb';

import { EditorModel } from '@utils/models/models/EditorModel';
import { joinModel } from '@utils/transforms/joinSubmodels';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@components/Editor/Context';

import {
    DetailWidget,
    WidgetApplyButton,
    WidgetDescription,
    WidgetLine,
    WidgetTitle,
} from '@elements/Widgets';

export function JoinModelWidget() {
    const ctx = React.useContext(EditorContext);
    const { setProcessing, selectedModel, selectedSubmodels, select } = ctx;

    if (selectedModel === null) return null;

    const apply = async () => {
        setProcessing(true);
        const joinedSubmodelIDs = await joinModel(selectedModel, selectedSubmodels);
        select(selectedModel, joinedSubmodelIDs);
        setProcessing(false);
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersDifference className="mr-2" />
                    Join Model
                </WidgetTitle>
                <WidgetApplyButton onApply={apply} />
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Join selected submodels into a single submodel.
                </WidgetDescription>
            </WidgetLine>
        </DetailWidget>
    );
}
