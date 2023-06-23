import { EditorModel, useModels, useSelection } from '@utils/utils';

import { ColumnContainer, OverflowContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';

import { Model } from './Model';

export function ModelList() {
    const models = useModels();
    const [select, selection] = useSelection();

    const handleSelect = (model: EditorModel) => {
        if (selection.size > 1) select(new Map([[model, new Set()]]));
        else if (selection.has(model)) select(new Map());
        else select(new Map([[model, new Set()]]));
    };

    return (
        <OverflowContainer>
            {models.length === 0 && <Empty>No models</Empty>}
            {models.length >= 0 && (
                <ColumnContainer className="p-4 space-y-2">
                    {models.map((model, index) => (
                        <Model
                            model={model}
                            key={model.name + index}
                            selected={selection.has(model)}
                            onSelect={() => handleSelect(model)}
                        />
                    ))}
                </ColumnContainer>
            )}
        </OverflowContainer>
    );
}
