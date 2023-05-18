import React from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { EditorContext } from '@components/Editor/Utils/Context';

import { EmptyDetailPanel, EmptyMetaPanel } from '@elements/Empty';

export function ModelMetaPanel() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { selectedModel, selection } = ctx;
    const [selected, setSelected] = React.useState<number[]>(
        selection.selected.map((obj) => obj.identifier)
    );

    React.useEffect(() => {
        const onChange = () => {
            setSelected(selection.selected.map((obj) => obj.identifier));
        };

        selection.onSelect = onChange;

        return () => {
            selection.removeOnSelect(onChange);
        };
    }, [selection]);

    if (selectedModel === null) return <EmptyDetailPanel />;
    if (selected.length === 0) return <EmptyMetaPanel />;

    return (
        <div className="p-4 space-y-4">
            {selected.map((id) => (
                <div key={id}>
                    <div className="text-2xl text-neutral-300">Part {id}</div>
                    <JsonView src={selectedModel.data[id]} />
                </div>
            ))}
        </div>
    );

    return null;
}
