import clsx from 'clsx';
import React from 'react';
import { RiBuilding2Fill } from 'react-icons/ri';

import { EditorModel } from '@utils/models/EditorModel';

interface ModelPanelProps {
    selected: boolean;
    onSelect: () => void;
    model: EditorModel;
}

function ModelPanel(props: ModelPanelProps): JSX.Element {
    const { model, onSelect, selected } = props;

    return (
        <div
            className={clsx(
                'text-lg px-4 py-2 rounded-md hover:shadow-even hover:-translate-y-1 transition-all cursor-pointer flex flex-row items-center',
                selected ? 'bg-amber-300 text-amber-900' : 'bg-white text-black'
            )}
            onClick={onSelect}
        >
            <RiBuilding2Fill
                className={clsx('mr-4', selected ? 'text-amber-900' : 'text-neutral-600')}
            />{' '}
            {model.name}
        </div>
    );
}

interface ModelListProps {
    models: EditorModel[];
    selectedModel: EditorModel | null;
    selectModel: (model: EditorModel | null) => void;
}

export function ModelList(props: ModelListProps) {
    const { models, selectedModel, selectModel } = props;

    return (
        <div className="flex flex-col p-4 space-y-2">
            {models.map((model) => (
                <ModelPanel
                    model={model}
                    key={model.name}
                    selected={selectedModel === model}
                    onSelect={() =>
                        selectedModel === model ? selectModel(null) : selectModel(model)
                    }
                />
            ))}
        </div>
    );
}
