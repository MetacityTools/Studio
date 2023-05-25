import React from 'react';

import { EditorContext } from '@components/Editor/Context';

import { EmptyDetailPanel } from '@elements/Empty';

import { DeleteModelWidget } from './Widgets/DeleteModel';
import { JoinSubmodelWidget } from './Widgets/JoinSubmodels';
import { SnapVerticesWidget } from './Widgets/SnapVertices';
import { SplitModelWidget } from './Widgets/SplitModel';
import { ModelTransformationWidget } from './Widgets/Transformation';
import { DeleteSubmodelsWidget } from './Widgets/DeleteSubmodels';

export function ModelTransformPanel() {
    const ctx = React.useContext(EditorContext);
    const { selectedModel } = ctx;

    if (selectedModel === null) return <EmptyDetailPanel />;

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget />
            <SnapVerticesWidget />
            <SplitModelWidget />
            <JoinSubmodelWidget />
            <DeleteSubmodelsWidget />
            <DeleteModelWidget />
        </div>
    );
}
