import React from 'react';
import { BsFillStopFill } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { MdDriveFileMoveRtl, MdOutlineDriveFileMove } from 'react-icons/md';
import { VscJson } from 'react-icons/vsc';

import { EditorModel, GroupNode as GroupNodeClass, deleteGroup } from '@utils/utils';
import { useSelection } from '@utils/utils';

import { useGraph, useLinkingNode, useMovingNode } from '@editor/Context/TableContext';

import {
    HierarchyButton,
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNodeRow,
    colorNodeBackground,
} from '@elements/Hierarchy';
import { If } from '@elements/If';

import { GroupNodeChildren } from './NodeGroupChildren';

export interface GroupNodeProps {
    model: EditorModel;
    submodels: Set<number>;
    node: GroupNodeClass;
}

export function GroupNode(props: GroupNodeProps) {
    const { model, node, submodels } = props;
    const [select] = useSelection();
    const [graph] = useGraph();
    const [nodeToMove, updateNodeToMove] = useMovingNode();
    const [nodeToLink, updateNodeToLink] = useLinkingNode();
    const [open, setOpen] = React.useState(true);

    const isSelected = React.useMemo(() => node.selected(submodels), [node, submodels]);
    const isLinking = React.useMemo(() => node === nodeToLink, [node, nodeToLink]);
    const isMoving = React.useMemo(() => node === nodeToMove, [node, nodeToMove]);
    const isDescendant = React.useMemo(
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
        if (node === nodeToMove) updateNodeToMove(undefined);
        if (node === nodeToLink) updateNodeToLink(undefined);
        e.stopPropagation();
    };

    const handleToMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateNodeToMove(node);
        e.stopPropagation();
    };

    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateNodeToLink(node);
        e.stopPropagation();
    };

    const bg = colorNodeBackground(isSelected, isMoving || isLinking);
    const bgMoving = colorNodeBackground(isMoving, isSelected || isLinking);
    const bgLinking = colorNodeBackground(isLinking, isSelected || isMoving);

    return (
        <div className="flex flex-col rounded-md">
            <HierarchyNodeRow>
                <HierarchyChevronButton open={open} onClick={handleOpen} bg={bg} />
                <HierarchyMainButton onClick={handleSelect} bg={bg}>
                    Group of {node.children.length} parts
                </HierarchyMainButton>
                <If cond={!nodeToMove}>
                    <HierarchyButton bg={bg} onClick={handleRemove} title="Delete group">
                        <FiDelete />
                    </HierarchyButton>
                </If>
                <If cond={!isDescendant}>
                    <If cond={!nodeToMove}>
                        <HierarchyButton
                            onClick={handleToMove}
                            bg={bgMoving}
                            title="Move in hierarchy"
                        >
                            <MdOutlineDriveFileMove />
                        </HierarchyButton>
                    </If>
                    <If cond={nodeToMove && !isMoving}>
                        <HierarchyButton
                            onClick={handleToMove}
                            bg={bgMoving}
                            title="Move here in hierarchy"
                        >
                            <MdDriveFileMoveRtl />
                        </HierarchyButton>
                    </If>
                    <If cond={isMoving}>
                        <HierarchyButton onClick={handleToMove} bg={bgMoving} title="End Move">
                            <BsFillStopFill />
                        </HierarchyButton>
                    </If>
                </If>
                <If cond={!nodeToMove}>
                    <HierarchyButton
                        bg={bgLinking}
                        onClick={handleLink}
                        title="Link to selected rows in table"
                    >
                        <VscJson />
                    </HierarchyButton>
                </If>
            </HierarchyNodeRow>
            {open && (
                <GroupNodeChildren {...props} nodeToMove={nodeToMove} nodeToLink={nodeToLink} />
            )}
        </div>
    );
}
