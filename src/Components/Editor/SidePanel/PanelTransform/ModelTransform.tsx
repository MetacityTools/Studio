import React from 'react';

import { EditorContext } from '@components/Editor/Context';

import { EmptyDetailPanel } from '@elements/Empty';

import { DeleteModelWidget } from './Widgets/DeleteModel';
import { JoinModelWidget } from './Widgets/JoinModels';
import { SnapVerticesWidget } from './Widgets/SnapVertices';
import { SplitModelWidget } from './Widgets/SplitModel';
import { ModelTransformationWidget } from './Widgets/Transformation';

export function ModelTransformPanel() {
    const ctx = React.useContext(EditorContext);
    const { selectedModel } = ctx;

    if (selectedModel === null) return <EmptyDetailPanel />;

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget />
            <SnapVerticesWidget />
            <SplitModelWidget />
            <JoinModelWidget />
            <DeleteModelWidget />
        </div>
    );
}
