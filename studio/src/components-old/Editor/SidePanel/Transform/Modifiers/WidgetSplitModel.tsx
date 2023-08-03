import { useSelectedModels, useSplitModel } from '@hooks/hooks';
import { TbLayersIntersect } from 'react-icons/tb';

import { useProcessing } from '@elements/GlobalContext';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { WidgetProps } from './Widget';

export function SplitModelWidget(props: WidgetProps) {
    const split = useSplitModel();
    const selection = useSelectedModels();
    const [, setProcessing] = useProcessing();

    const apply = async () => {
        const submodelIDs = selection.get(props.model);
        if (!submodelIDs) return; //TODO handle with a popup
        setProcessing(true, 'Splitting model...');
        await split(props.model, submodelIDs);
        setProcessing(false, 'Model splitting finised');
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersIntersect className="mr-2" />
                    Split Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Split the model based on the current selection, the selected parts will be
                    removed from the original model and placed into a new model.
                </WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
