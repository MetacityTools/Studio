import { FiDelete } from 'react-icons/fi';

import { useRemoveModels } from '@utils/utils';

import { Widget, WidgetDescription, WidgetLine, WidgetTitle } from '@elements/Widgets';

import { WidgetProps } from './Widget';

export function DeleteModelWidget(props: WidgetProps) {
    const remove = useRemoveModels();

    const apply = () => {
        remove(props.model);
    };

    return (
        <Widget onClick={apply}>
            <WidgetLine>
                <WidgetTitle>
                    <FiDelete className="mr-2" />
                    Delete Model
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>Delete the model from the scene.</WidgetDescription>
            </WidgetLine>
        </Widget>
    );
}