import React from 'react';

import { EditorContext } from '@editor/Context/EditorContext';

import { EmptyDetailPanel } from '@elements/Empty';

import { DeleteModelWidget } from './Widgets/DeleteModel';
import { DeleteSubmodelsWidget } from './Widgets/DeleteSubmodels';
import { JoinSubmodelWidget } from './Widgets/JoinSubmodels';
import { SnapVerticesWidget } from './Widgets/SnapVertices';
import { SplitModelWidget } from './Widgets/SplitModel';
import { ModelTransformationWidget } from './Widgets/Transformation';

export function ModelTransformPanel() {
    const { selectedModel } = React.useContext(EditorContext);

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
