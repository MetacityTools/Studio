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

interface SnapVerticesProps {
    scene: GL.Scene;
    model: EditorModel;
    selection: GL.SelectionManager;
}

export function JoinModelWidget(props: SnapVerticesProps) {
    const { scene, model, selection } = props;
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { setProcessing } = ctx;

    const apply = async () => {
        setProcessing(true);
        await joinModel(model, selection);
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
