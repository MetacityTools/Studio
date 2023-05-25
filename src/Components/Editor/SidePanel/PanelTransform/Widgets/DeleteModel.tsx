import React from 'react';
import { FiDelete } from 'react-icons/fi';

import { EditorContext } from '@components/Editor/Context';

import {
    DetailWidget,
    WidgetApplyButton,
    WidgetDescription,
    WidgetLine,
    WidgetTitle,
} from '@elements/Widgets';

export function DeleteModelWidget() {
    const ctx = React.useContext(EditorContext);
    const { scene, selectedModel } = ctx;
    if (selectedModel === null) return null;

    const apply = () => {
        scene.remove(selectedModel);
    };

    return (
        <DetailWidget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <FiDelete className="mr-2" />
                    Delete Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Delete the model from the scene.</WidgetDescription>
            </WidgetLine>
        </DetailWidget>
    );
}
