import clsx from 'clsx';
import React from 'react';
import { FiChevronRight, FiDelete } from 'react-icons/fi';
import { MdDriveFileMoveRtl, MdOutlineDriveFileMove } from 'react-icons/md';

import { deleteGroup } from '@utils/hierarchy/deleteGroup';
import { ModelGroupNode, ModelNode, Node } from '@utils/hierarchy/modelGraph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext, HierarchyContext } from '@editor/Context';

import { ModelNodePanel, colorNodeBackground } from './ModelPanel';

interface GroupNodePanelProps {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelGroupNode;
}

export function GroupNodePanel(props: GroupNodePanelProps) {
    const { model, node, submodels } = props;
    const [open, setOpen] = React.useState(false);
    const ctx = React.useContext(EditorContext);
    const { select } = ctx;
    const hierarchyCtx = React.useContext(HierarchyContext);
    const { graph, nodeToMove, setNodeToMove } = hierarchyCtx;

    const isSelected = React.useMemo(() => node.selected(submodels), [node, submodels]);

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const children = node.getAllLeaveIds();
        if (!isSelected) select(model, children, false, true);
        else select(model, children, true, true);
        e.stopPropagation();
    };

    const handleOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setOpen(!open);
        e.stopPropagation();
    };

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        deleteGroup(node, graph);
        e.stopPropagation();
    };

    const handleToMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setNodeToMove((prev) => {
            if (prev === node) return undefined;
            if (prev === undefined) return node;
            else {
                if (node.isDescendantOf(prev)) return undefined;

                const prevParent = prev.parent;
                if (prevParent) prevParent.removeChild(prev);
                node.addChild(prev);
                prev.addParent(node);
                graph.needsUpdate = true;

                if (prevParent?.children.length === 0) prevParent.parent?.removeChild(prevParent);
                return undefined;
            }
        });
        e.stopPropagation();
    };

    return (
        <div className="flex flex-col rounded-md">
            <GroupParentPanel
                {...props}
                open={handleOpen}
                select={handleSelect}
                remove={handleRemove}
                move={handleToMove}
                nodeToMove={nodeToMove}
                opened={open}
            />
            {open && <GroupChildrenPanel {...props} />}
        </div>
    );
}

interface GroupParentPanelProps extends GroupNodePanelProps {
    open: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    select: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    remove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    move: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    opened: boolean;
    nodeToMove?: Node;
}

function GroupParentPanel(props: GroupParentPanelProps) {
    const { opened, submodels, node, open, select, remove, move, nodeToMove } = props;

    const bg = colorNodeBackground(node.selected(submodels));
    const isDescendantOfSelected = React.useMemo(
        () => nodeToMove && node.isDescendantOf(nodeToMove),
        [node, nodeToMove]
    );

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
                {node.children.length} Nodes
            </button>
            <button className={clsx(bg, 'px-4 py-2 last:rounded-r')} onClick={remove}>
                <FiDelete />
            </button>
            {nodeToMove ? (
                !isDescendantOfSelected && (
                    <button className={clsx(bg, 'px-4 py-2 rounded-r')} onClick={move}>
                        <MdDriveFileMoveRtl />
                    </button>
                )
            ) : (
                <button className={clsx(bg, 'px-4 py-2 rounded-r')} onClick={move}>
                    <MdOutlineDriveFileMove />
                </button>
            )}
        </div>
    );
}

function GroupChildrenPanel(props: GroupNodePanelProps) {
    const { model, submodels, node } = props;

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
