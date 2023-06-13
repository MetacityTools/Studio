import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import { useGraph, useSelection } from '@utils/utils';

import { EmptyMetadata } from '@elements/Empty';

export function Metadata() {
    const [, selection] = useSelection();
    const [graph] = useGraph();

    if (selection.size === 0) return <EmptyMetadata />;

    return (
        <div className="p-4 space-y-4">
            {Array.from(selection).map(([model, submodels]) =>
                Array.from(submodels).map((id) => (
                    <div key={id}>
                        <div className="text-2xl text-neutral-300">
                            Model {model.name} - Part {id}
                        </div>
                        <JsonView src={graph.getModel(model, id)?.data ?? 'No data found'} />
                    </div>
                ))
            )}
        </div>
    );
}
