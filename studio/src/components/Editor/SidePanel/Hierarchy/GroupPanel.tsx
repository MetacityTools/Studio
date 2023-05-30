import clsx from 'clsx';
import React from 'react';
import { BiRename } from 'react-icons/bi';
import { FiChevronRight } from 'react-icons/fi';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import { ModelGroupNode, ModelNode } from '@utils/hierarchy/modelGraph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@editor/Context';

import { ModelNodePanel, colorNodeBackground } from './ModelPanel';

interface GroupNodePanelProps {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelGroupNode;
}

export function GroupNodePanel(props: GroupNodePanelProps) {
    const { model, submodels, node } = props;
    const [open, setOpen] = React.useState(false);
    const ctx = React.useContext(EditorContext);
    const { select } = ctx;

    const selectRecursive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const children = node.getAllLeaveIds();
        select(model, children, false, true);
        e.stopPropagation();
    };

    const toggleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    return (
        <div className="flex flex-col rounded-md">
            <GroupParentPanel {...props} open={toggleOpen} select={selectRecursive} opened={open} />
            {open && <GroupChildrenPanel model={model} submodels={submodels} node={node} />}
        </div>
    );
}

interface GroupParentPanelProps extends GroupNodePanelProps {
    open: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    select: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    opened: boolean;
}

function GroupParentPanel(props: GroupParentPanelProps) {
    const { opened, submodels, node, open, select } = props;

    const bg = colorNodeBackground(node.selected(submodels));
    console.log(node.selected(submodels));

    return (
        <div className="flex flex-row justify-between items-center">
            <button className={clsx('px-2 py-2 rounded-l', bg)} onClick={open}>
                <FiChevronRight
                    className={clsx('w-4 h-4 transition-all', opened && 'transform rotate-90')}
                />
            </button>
            <button
                className={clsx(
                    bg,
                    'px-2 flex-1 text-left text-ellipsis overflow-hidden whitespace-nowrap'
                )}
                onClick={select}
            >
                Group Name
            </button>
            <button className={clsx(bg, 'px-4 py-2')}>
                <BiRename />
            </button>
            <button className={clsx(bg, 'px-4 py-2 rounded-r')}>
                <MdOutlineDriveFileMove />
            </button>
        </div>
    );
}

function GroupChildrenPanel(props: GroupNodePanelProps) {
    const { model, submodels, node } = props;

    console.log(node);
    return (
        <div className="mt-1 pl-8 space-y-1">
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
