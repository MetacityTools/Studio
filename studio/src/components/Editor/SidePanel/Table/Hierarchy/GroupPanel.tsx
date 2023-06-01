import React from 'react';
import { FiDelete } from 'react-icons/fi';
import { MdDriveFileMoveRtl, MdOutlineDriveFileMove } from 'react-icons/md';

import { deleteGroup } from '@utils/hierarchy/deleteGroup';
import { ModelGroupNode } from '@utils/hierarchy/graph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';

import {
    HierarchyButton,
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNodeRow,
    colorNodeBackground,
} from '@elements/Hierarchy';

import { GroupChildrenPanel } from './GroupChildrenPanel';

export interface GroupNodePanelProps {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelGroupNode;
}

export function GroupNodePanel(props: GroupNodePanelProps) {
    const { model, node, submodels } = props;
    const [open, setOpen] = React.useState(false);
    const { select } = React.useContext(EditorContext);
    const { graph, nodeToMove, setNodeToMove } = React.useContext(TablesContext);

    const isSelected = React.useMemo(() => node.selected(submodels), [node, submodels]);
    const isDescendantOfSelected = React.useMemo(
        () => nodeToMove && node.isDescendantOf(nodeToMove),
        [node, nodeToMove]
    );

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

    const bg = colorNodeBackground(node.selected(submodels), nodeToMove === node);

    return (
        <div className="flex flex-col rounded-md">
            <HierarchyNodeRow>
                <HierarchyChevronButton open={open} onClick={handleOpen} bg={bg} />
                <HierarchyMainButton onClick={handleSelect} bg={bg}>
                    {node.children.length} Parts
                </HierarchyMainButton>
                <HierarchyButton bg={bg} onClick={handleRemove}>
                    <FiDelete />
                </HierarchyButton>
                {!isDescendantOfSelected && (
                    <HierarchyButton bg={bg} onClick={handleToMove}>
                        {nodeToMove ? <MdDriveFileMoveRtl /> : <MdOutlineDriveFileMove />}
                    </HierarchyButton>
                )}
            </HierarchyNodeRow>
            {open && <GroupChildrenPanel {...props} />}
        </div>
    );
}
