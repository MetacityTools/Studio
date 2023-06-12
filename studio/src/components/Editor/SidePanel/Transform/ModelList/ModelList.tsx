import React from 'react';

import { useModels, useSelection } from '@utils/utils';

import { EmptyList } from '@elements/Empty';

import { Model } from './Model';

export function ModelList() {
    const models = useModels();
    const [select, selection] = useSelection();

    return (
        <div className="overflow-x-auto w-full h-full">
            {models.length === 0 && <EmptyList />}
            {models.length >= 0 && (
                <div className="flex flex-col p-4 space-y-2">
                    {models.map((model, index) => (
                        <Model
                            model={model}
                            key={model.name + index}
                            selected={selection.has(model)}
                            onSelect={() =>
                                //TODO how to handle this??
                                selection.has(model)
                                    ? select(new Map())
                                    : select(new Map([[model, new Set()]]))
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
