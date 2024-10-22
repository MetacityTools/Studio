import { Empty } from '@elements/Empty';

import { useSelected } from '@hooks/useSelected';

import { DeleteSubmodelsWidget } from './WidgetDeleteSubmodels';
import { JoinSubmodelWidget } from './WidgetJoinSubmodels';
import { MappingWidget } from './WidgetMapping';
import { SplitModelWidget } from './WidgetSplitModel';
import { ModelTransformationWidget } from './WidgetTransformation';

export function Modifiers() {
    const selection = useSelected();

    if (selection.size === 0) return <Empty>Nothing selected</Empty>;
    if (selection.size > 1) return <Empty>Select only a single model</Empty>;
    const model = Array.from(selection)[0][0];

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget model={model} />
            <SplitModelWidget model={model} />
            <JoinSubmodelWidget model={model} />
            <DeleteSubmodelsWidget model={model} />
            <MappingWidget model={model} />
        </div>
    );
}
