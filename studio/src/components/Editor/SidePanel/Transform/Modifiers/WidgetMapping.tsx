import { BsLayersFill, BsLayersHalf } from 'react-icons/bs';

import { EditorModel } from '@utils/utils';

import { useProcessing } from '@elements/Context';
import {
    Widget,
    WidgetButton,
    WidgetDescription,
    WidgetLine,
    WidgetPrompt,
    WidgetTitle,
} from '@elements/Widgets';

import { useModels, useProjectModels } from '@shared/Context/hooks';

import { WidgetProps } from './Widget';

export function MappingWidget(props: WidgetProps) {
    const project = useProjectModels();
    const models = useModels();
    const [, setProcessing] = useProcessing();

    const apply = async (target: EditorModel) => {
        setProcessing(true, 'Projecting models...');
        await project(props.model, target);
        setProcessing(false);
    };

    return (
        <Widget>
            <WidgetLine>
                <WidgetTitle>
                    <BsLayersHalf className="mr-2" />
                    Projection Mapping
                </WidgetTitle>
            </WidgetLine>
            <WidgetLine>
                <WidgetDescription>
                    Project the geometry of the selected model onto another model.
                </WidgetDescription>
            </WidgetLine>
            <WidgetLine>
                <WidgetPrompt>Select a model to project onto:</WidgetPrompt>
            </WidgetLine>
            {models.map((model) => {
                if (model === props.model) return null;
                return (
                    <WidgetLine key={model.name}>
                        <WidgetButton onClick={() => apply(model)}>
                            <BsLayersFill className="mr-2 text-xs" />
                            {model.name}
                        </WidgetButton>
                    </WidgetLine>
                );
            })}
        </Widget>
    );
}
