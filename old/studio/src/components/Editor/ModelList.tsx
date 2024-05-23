import { ColumnContainer, OverflowContainer } from '@elements/Containers';
import { Empty } from '@elements/Empty';

import { EditorModel } from '@data/EditorModel';

import { useModels } from '@hooks/useModels';
import { useSelected } from '@hooks/useSelected';
import { useSelection } from '@hooks/useSelection';

import { ModelItem } from './ModelItem';

export function ModelList() {
    const models = useModels();
    const select = useSelection();
    const selection = useSelected();

    const handleSelect = (model: EditorModel) => {
        if (selection.size > 1) select(new Map([[model, new Set()]]));
        else if (selection.has(model)) select(new Map());
        else {
            const submodels = Object.keys(model.metadata).map((submodel) => parseInt(submodel));
            select(new Map([[model, new Set(submodels)]]));
        }
    };

    return (
        <OverflowContainer>
            <ColumnContainer>
                {models.length === 0 && <Empty>No models</Empty>}
                {models.length >= 0 &&
                    models.map((model, index) => (
                        <ModelItem
                            model={model}
                            key={model.name + index}
                            selected={selection.has(model)}
                            onSelect={() => handleSelect(model)}
                        />
                    ))}
            </ColumnContainer>
        </OverflowContainer>
    );
}
