import { TbLayersUnion } from 'react-icons/tb';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { useJoinSubmodels } from '@hooks/useJoinSubmodels';
import { useProcessing } from '@hooks/useProcessing';
import { useSelected } from '@hooks/useSelected';

import { WidgetProps } from './Widget';

export function JoinSubmodelWidget(props: WidgetProps) {
    const join = useJoinSubmodels();
    const [, setProcessing] = useProcessing();
    const selection = useSelected();

    const apply = async () => {
        const submodelIDs = selection.get(props.model);
        if (!submodelIDs) return; //TODO handle with a popup
        setProcessing(true, 'Joining submodels...');
        await join(props.model, submodelIDs);
        setProcessing(false, 'Finished joining submodels');
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
