import React from 'react';

import { useSelection } from '@utils/utils';

import { EmptyDetail } from '@elements/Empty';

import { DeleteModelWidget } from './WidgetDeleteModel';
import { DeleteSubmodelsWidget } from './WidgetDeleteSubmodels';
import { JoinSubmodelWidget } from './WidgetJoinSubmodels';
import { SnapVerticesWidget } from './WidgetSnapVertices';
import { SplitModelWidget } from './WidgetSplitModel';
import { ModelTransformationWidget } from './WidgetTransformation';

export function Modifiers() {
    const [, selectedModel] = useSelection();

    if (selectedModel === null) return <EmptyDetail />;

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
