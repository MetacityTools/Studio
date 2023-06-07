import React from 'react';

import { useModels, useSelection } from '@utils/utils';

import { EmptyList } from '@elements/Empty';

import { Model } from './Model';

export function ModelList() {
    const models = useModels();
    const [select, selectedModel] = useSelection();

    return (
        <div className="overflow-x-auto w-full h-full">
            {models.length === 0 && <EmptyList />}
            {models.length >= 0 && (
                <div className="flex flex-col p-4 space-y-2">
                    {models.map((model, index) => (
                        <Model
                            model={model}
                            key={model.name + index}
                            selected={selectedModel === model}
                            onSelect={() =>
                                selectedModel === model ? select(null) : select(model)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
