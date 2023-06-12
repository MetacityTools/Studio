import React from 'react';

import { useSelectedModels } from '@utils/utils';

import { EmptyDetail, TooManySelected } from '@elements/Empty';

import { DeleteModelWidget } from './WidgetDeleteModel';
import { DeleteSubmodelsWidget } from './WidgetDeleteSubmodels';
import { JoinSubmodelWidget } from './WidgetJoinSubmodels';
import { SplitModelWidget } from './WidgetSplitModel';
import { ModelTransformationWidget } from './WidgetTransformation';

export function Modifiers() {
    const selection = useSelectedModels();

    if (selection.size === 0) return <EmptyDetail />;
    if (selection.size > 1) return <TooManySelected />;
    const model = Array.from(selection)[0][0];

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget model={model} />
            <SplitModelWidget model={model} />
            <JoinSubmodelWidget model={model} />
            <DeleteSubmodelsWidget model={model} />
            <DeleteModelWidget model={model} />
        </div>
    );
}
