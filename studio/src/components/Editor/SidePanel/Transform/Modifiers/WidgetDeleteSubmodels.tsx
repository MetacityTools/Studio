import { FiDelete } from 'react-icons/fi';

import { useProcessing } from '@elements/Context';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { useRemoveSubmodels, useSelectedModels } from '@shared/Context/hooks';

import { WidgetProps } from './Widget';

export function DeleteSubmodelsWidget(props: WidgetProps) {
    const removeSubmodels = useRemoveSubmodels();
    const selection = useSelectedModels();
    const [, setProcessing] = useProcessing();

    const apply = async () => {
        const selectedSubmodels = selection.get(props.model);
        if (!selectedSubmodels) return; //TODO handle with a popup
        setProcessing(true, 'Deleting submodels...');
        await removeSubmodels(props.model, selectedSubmodels);
        setProcessing(false);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <FiDelete className="mr-2" />
                    Delete Selected
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Remove the selected submodels from the model.</WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
