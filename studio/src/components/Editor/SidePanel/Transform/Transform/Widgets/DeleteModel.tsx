import React from 'react';
import { FiDelete } from 'react-icons/fi';

import { EditorContext } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

export function DeleteModelWidget() {
    const { scene, selectedModel } = React.useContext(EditorContext);

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
