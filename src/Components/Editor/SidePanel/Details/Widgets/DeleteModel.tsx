import React from 'react';
import { FiDelete } from 'react-icons/fi';

import { EditorModel } from '@utils/models/models/EditorModel';

import * as GL from '@bananagl/bananagl';

import {
    DetailWidget,
    WidgetApplyButton,
    WidgetDescription,
    WidgetLine,
    WidgetTitle,
} from '@elements/Widgets';

interface DeleteModelProps {
    scene: GL.Scene;
    model: EditorModel;
}

export function DeleteModelWidget(props: DeleteModelProps) {
    const { scene, model } = props;

    const apply = () => {
        scene.remove(model);
    };

    return (
        <DetailWidget>
            <WidgetLine>
                <WidgetTitle>
                    <FiDelete className="mr-2" />
                    Delete Model
                </WidgetTitle>
                <WidgetApplyButton onApply={apply} text="Delete" />
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Delete the model from the scene.</WidgetDescription>
            </WidgetLine>
        </DetailWidget>
    );
}
