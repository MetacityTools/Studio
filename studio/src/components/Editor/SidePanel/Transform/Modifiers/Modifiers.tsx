import { Empty } from '@elements/Empty';

import { useSelectedModels } from '@shared/Context/hooks';

import { DeleteSubmodelsWidget } from './WidgetDeleteSubmodels';
import { JoinSubmodelWidget } from './WidgetJoinSubmodels';
import { SplitModelWidget } from './WidgetSplitModel';
import { ModelTransformationWidget } from './WidgetTransformation';

export function Modifiers() {
    const selection = useSelectedModels();

    if (selection.size === 0) return <Empty>Nothing selected</Empty>;
    if (selection.size > 1) return <Empty>Select only a single model</Empty>;
    const model = Array.from(selection)[0][0];

    return (
        <div className="p-4 space-y-4">
            <ModelTransformationWidget model={model} />
            <SplitModelWidget model={model} />
            <JoinSubmodelWidget model={model} />
            <DeleteSubmodelsWidget model={model} />
        </div>
    );
}
