import { TbLayersUnion } from 'react-icons/tb';

import { useProcessing } from '@elements/Context';
import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { useJoinSubmodels, useSelection } from '@shared/Context/hooks';

import { WidgetProps } from './Widget';

export function JoinSubmodelWidget(props: WidgetProps) {
    const join = useJoinSubmodels();
    const [, selection] = useSelection();
    const [, setProcessing] = useProcessing();

    const apply = async () => {
        const submodelIDs = selection.get(props.model);
        if (!submodelIDs) return; //TODO handle with a popup
        setProcessing(true, 'Joining submodels...');
        await join(props.model, submodelIDs);
        setProcessing(false);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <TbLayersUnion className="mr-2" />
                    Join Submodels
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Join selected submodels into a single submodel.
                </WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}
