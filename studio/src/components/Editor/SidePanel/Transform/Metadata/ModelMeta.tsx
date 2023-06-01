import React from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { EditorContext } from '@editor/Context/EditorContext';

import { EmptyDetailPanel, EmptyMetaPanel } from '@elements/Empty';

export function ModelMetaPanel() {
    const { selectedModel, selectedSubmodels } = React.useContext(EditorContext);

    if (selectedModel === null) return <EmptyDetailPanel />;
    if (selectedSubmodels.length === 0) return <EmptyMetaPanel />;

    return (
        <div className="p-4 space-y-4">
            {selectedSubmodels.map((id) => (
                <div key={id}>
                    <div className="text-2xl text-neutral-300">Part {id}</div>
                    <JsonView src={selectedModel.data[id]} />
                </div>
            ))}
        </div>
    );
}
