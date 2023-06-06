import React from 'react';
import { FiDelete } from 'react-icons/fi';

import { useScene, useSelection } from '@utils/utils';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function DeleteModelWidget() {
    const scene = useScene();
    const [, selectedModel] = useSelection();

    if (selectedModel === null) return null;

    const apply = () => {
        scene.remove(selectedModel);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <FiDelete className="mr-2" />
                    Delete Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Delete the model from the scene.</WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
