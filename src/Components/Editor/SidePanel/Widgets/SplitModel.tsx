import React from 'react';
import { TbLayersDifference } from 'react-icons/tb';

import { EditorModel } from '@utils/models/EditorModel';
import { splitModel } from '@utils/transforms/modelSplit';

import * as GL from '@bananagl/bananagl';

import { EditorContext } from '@components/Editor/Editor';

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

export function SplitModelWidget(props: SnapVerticesProps) {
    const { scene, model, selection } = props;
    const context = React.useContext(EditorContext);

    const apply = async () => {
        context?.setProcessing(true);
        await splitModel(scene, model, selection);
        context?.setProcessing(false);
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersDifference className="mr-2" />
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
