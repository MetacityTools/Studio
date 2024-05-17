import { FiDelete } from 'react-icons/fi';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { useProcessing } from '@hooks/useProcessing';
import { useRemoveSubmodels } from '@hooks/useRemoveSubmodels';
import { useSelected } from '@hooks/useSelected';

import { WidgetProps } from './Widget';

export function DeleteSubmodelsWidget(props: WidgetProps) {
    const removeSubmodels = useRemoveSubmodels();
    const selection = useSelected();
    const [, setProcessing] = useProcessing();

    const apply = async () => {
        const selectedSubmodels = selection.get(props.model);
        if (!selectedSubmodels) return; //TODO handle with a popup
        setProcessing(true, 'Deleting submodels...');
        await removeSubmodels(props.model, selectedSubmodels);
        setProcessing(false, 'Finished deleting');
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
