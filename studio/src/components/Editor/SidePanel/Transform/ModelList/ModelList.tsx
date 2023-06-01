import React from 'react';

import { EmptyList } from '@elements/Empty';

import { EditorContext } from '../../../Context/EditorContext';
import { Model } from './Model';

export function ModelList() {
    const { selectedModel, select, models } = React.useContext(EditorContext);

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
