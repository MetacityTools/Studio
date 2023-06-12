import { TbLayersSubtract } from 'react-icons/tb';

import { useRemoveSubmodels, useSelectedModels } from '@utils/utils';

import { useProcessing } from '@editor/Context/EditorContext';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { WidgetProps } from './Widget';

export function DeleteSubmodelsWidget(props: WidgetProps) {
    const removeSubmodels = useRemoveSubmodels();
    const selection = useSelectedModels();
    const [, setProcessing] = useProcessing();

    const apply = async () => {
        const selectedSubmodels = selection.get(props.model);
        if (!selectedSubmodels) return; //TODO handle with a popup
        setProcessing(true);
        await removeSubmodels(props.model, selectedSubmodels);
        setProcessing(false);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersSubtract className="mr-2" />
                    Delete Submodels
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Remove the selected submodels from the model.</WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}