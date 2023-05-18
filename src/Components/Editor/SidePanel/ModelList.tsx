import React from 'react';

import { EmptyDataPanel } from '@elements/Empty';

import { EditorContext } from '../Context';
import { ModelPanel } from './ModelList/ModelPanel';

export function ModelList() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { selectedModel, selectModel, models } = ctx;

    return (
        <div className="overflow-x-auto w-full h-full">
            {models.length === 0 && <EmptyDataPanel />}
            {models.length >= 0 && (
                <div className="flex flex-col p-4 space-y-2">
                    {models.map((model, index) => (
                        <ModelPanel
                            model={model}
                            key={model.name + index}
                            selected={selectedModel === model}
                            onSelect={() =>
                                selectedModel === model ? selectModel(null) : selectModel(model)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
