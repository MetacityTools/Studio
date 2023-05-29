import clsx from 'clsx';
import React from 'react';

import { ModelGroupNode, ModelNode } from '@utils/hierarchy/modelGraph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@editor/Context';

import { ModelNodePanel } from './ModelPanel';

type GroupNodePanelProps = {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelGroupNode;
};

export function GroupNodePanel(props: GroupNodePanelProps) {
    const { model, submodels, node } = props;
    const [open, setOpen] = React.useState(false);
    const ctx = React.useContext(EditorContext);
    const { select } = ctx;

    const selectRecursive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const children = node.getAllLeaveIds();
        select(model, children, false, true);
        e.stopPropagation();
    };

    const toggleOpen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    return (
        <div className="flex flex-col rounded-md">
            <div
                className={clsx(
                    'px-4 py-2 rounded-md text-left flex flex-row justify-between items-center',
                    node.allModelsSelected(submodels)
                        ? 'bg-amber-300'
                        : 'bg-neutral-200 hover:bg-neutral-300'
                )}
                onClick={selectRecursive}
            >
                <div className="flex flex-row">
                    <div onClick={toggleOpen}>open</div>
                    <div>Group</div>
                </div>
                <div className="space-x-2">
                    <button>move</button>
                    <button>rename</button>
                </div>
            </div>
            {open && <GroupChildrenPanel model={model} submodels={submodels} node={node} />}
        </div>
    );
}

export function GroupChildrenPanel(props: GroupNodePanelProps) {
    const { model, submodels, node } = props;
    return (
        <div className="py-2 pl-8 space-y-2">
            {node.children?.map(
                (child, index) =>
                    child instanceof ModelGroupNode && (
                        <GroupNodePanel
                            key={`group-${index}`}
                            model={model}
                            submodels={submodels}
                            node={child}
                        />
                    )
            )}
            {node.children?.map(
                (child, index) =>
                    child instanceof ModelNode && (
                        <ModelNodePanel
                            key={`node-${index}`}
                            model={model}
                            submodels={submodels}
                            node={child}
                        />
                    )
            )}
        </div>
    );
}
