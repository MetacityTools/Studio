import clsx from 'clsx';
import React from 'react';

import { ModelNode } from '@utils/hierarchy/modelGraph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@editor/Context';

type ModelNodePanelProps = {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelNode;
};

export function ModelNodePanel(props: ModelNodePanelProps) {
    const { model, submodels, node } = props;
    const ctx = React.useContext(EditorContext);
    const { select } = ctx;

    return (
        <div
            className={clsx(
                'py-1 px-4 rounded-md cursor-pointer transition-colors flex flex-row justify-between items-center',
                submodels.has(node.submodelId!)
                    ? 'bg-amber-300'
                    : 'bg-neutral-100 hover:bg-neutral-200'
            )}
            onClick={() => select(model, [node.submodelId!], true, true)}
        >
            <div>{node.submodelId}</div>
            <div>
                <button>move</button>
            </div>
        </div>
    );
}
