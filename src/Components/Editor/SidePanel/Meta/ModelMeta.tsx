import React from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@components/Editor/Utils/Context';

import { EmptyDetailPanel, EmptyMetaPanel } from '@elements/Empty';

//export async function retrieveMetadata(model: IFCModel, loader: IFCLoader, id: number) {
//    const ifc = loader.ifcManager;
//    const modelID = model.modelID;
//    return ifc.getItemProperties(modelID, id, true);
//}

function getModelMeta(model: EditorModel, id: number) {
    return model.data[id];
}

export function ModelMetaPanel() {
    const ctx = React.useContext(EditorContext);
    if (!ctx) return null;
    const { scene, renderer, selectedModel, selection } = ctx;
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
                    <JsonView src={getModelMeta(selectedModel, id)} />
                </div>
            ))}
        </div>
    );

    return null;
}
