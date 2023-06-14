import React from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { useGraph, useSelection } from '@utils/utils';

import { EmptyMetadata, TooManySelected } from '@elements/Empty';

export function Metadata() {
    const [, selection] = useSelection();
    const [graph] = useGraph();
    const [countVisible, setCountVisible] = React.useState(10);

    if (selection.size === 0) return <EmptyMetadata />;
    if (selection.size > 1) return <TooManySelected />;

    const [model, submodels] = Array.from(selection)[0];
    return (
        <div className="p-4 space-y-4">
            {Array.from(submodels)
                .slice(0, countVisible)
                .map((id) => (
                    <div key={id}>
                        <div className="text-2xl text-neutral-300">Part {id}</div>
                        <JsonView src={graph.getModel(model, id)?.data ?? 'No data found'} />
                    </div>
                ))}

            {countVisible < submodels.size && (
                <div
                    className="text-neutral-400 pl-10 cursor-pointer hover:text-neutral-500"
                    onClick={() => setCountVisible(countVisible + 10)}
                >
                    + {submodels.size - countVisible} more models
                </div>
            )}
        </div>
    );
}
