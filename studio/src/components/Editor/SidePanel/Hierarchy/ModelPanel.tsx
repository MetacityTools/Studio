import clsx from 'clsx';
import React from 'react';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import { ModelNode } from '@utils/hierarchy/modelGraph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@editor/Context';

type ModelNodePanelProps = {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelNode;
};

export function colorNodeBackground(selected: boolean) {
    return selected
        ? 'text-amber-800 bg-amber-300 hover:bg-amber-200 outline-none'
        : 'text-neutral-800 bg-neutral-100 hover:bg-neutral-200 outline-none';
}

export function ModelNodePanel(props: ModelNodePanelProps) {
    const { model, submodels, node } = props;
    const ctx = React.useContext(EditorContext);
    const { select } = ctx;

    const selectModel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        select(model, [node.submodelId!], true, true);
        e.stopPropagation();
    };

    const bg = colorNodeBackground(submodels.has(node.submodelId));

    return (
        <div className="flex flex-row justify-between items-center">
            <button className={clsx('flex-1 text-left px-4 rounded-l', bg)} onClick={selectModel}>
                {node.submodelId}
            </button>
            <button className={clsx('px-4 py-2 rounded-r text-neutral-400', bg)}>
                <MdOutlineDriveFileMove />
            </button>
        </div>
    );
}
