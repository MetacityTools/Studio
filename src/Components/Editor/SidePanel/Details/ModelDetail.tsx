import React from 'react';

import { EditorContext } from '@components/Editor/Utils/Context';

import { EmptyDetailPanel } from '@elements/Empty';

import { DeleteModelWidget } from './Widgets/DeleteModel';
import { SnapVerticesWidget } from './Widgets/SnapVertices';
import { SplitModelWidget } from './Widgets/SplitModel';
import { ModelTransformationWidget } from './Widgets/Transformation';

export function ModelDetailPanel() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { scene, renderer, selectedModel, selection } = ctx;

    if (selectedModel === null) return <EmptyDetailPanel />;

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget model={selectedModel} renderer={renderer} />
            <SnapVerticesWidget model={selectedModel} />
            <SplitModelWidget model={selectedModel} scene={scene} selection={selection} />
            <DeleteModelWidget model={selectedModel} scene={scene} />
        </div>
    );
}
