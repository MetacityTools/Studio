import React from 'react';
import { BsFillStopFill } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { MdDriveFileMoveRtl, MdOutlineDriveFileMove } from 'react-icons/md';
import { VscJson } from 'react-icons/vsc';

import { GroupNode as GroupNodeClass, SelectionType, deleteGroup, useGraph } from '@utils/utils';
import { useSelection } from '@utils/utils';

import { useEditingNode, useMovingNode } from '@editor/Context/TableContext';

import {
    HierarchyButton,
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNode,
    HierarchyNodeGroup,
} from '@elements/Hierarchy';
import { If } from '@elements/If';

import { GroupNodeChildren } from './NodeGroupChildren';

export interface GroupNodeProps {
    node: GroupNodeClass;
    selectedModels: SelectionType;
}

export function GroupNode(props: GroupNodeProps) {
    const { node, selectedModels } = props;
    const [select] = useSelection();
    const [graph] = useGraph();
    const [nodeToMove, updateNodeToMove] = useMovingNode();
    const [nodeToLink, updateNodeToLink] = useEditingNode();
    const [open, setOpen] = React.useState(true);

    const isSelected = React.useMemo(() => node.selected(selectedModels), [node, selectedModels]);
    const isLinking = React.useMemo(() => node === nodeToLink, [node, nodeToLink]);
    const isMoving = React.useMemo(() => node === nodeToMove, [node, nodeToMove]);
    const isDescendant = React.useMemo(
        () => nodeToMove && node.isDescendantOf(nodeToMove),
        [node, nodeToMove]
    );

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const children = node.getTreeSelection();
        if (!isSelected) select(children, false, true);
        else select(children, true, true);
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

    const light = isSelected || isMoving || isLinking;
    return (
        <HierarchyNodeGroup>
            <HierarchyNode>
                <HierarchyChevronButton
                    open={open}
                    onClick={handleOpen}
                    active={isSelected}
                    light={light}
                    title="Show children parts"
                />
                <HierarchyMainButton onClick={handleSelect} active={isSelected} light={light}>
                    Group of {node.children.length} parts
                </HierarchyMainButton>
                <If cond={!nodeToMove}>
                    <HierarchyButton light={light} onClick={handleRemove} title="Delete group">
                        <FiDelete />
                    </HierarchyButton>
                </If>
                <If cond={!isDescendant}>
                    <If cond={!nodeToMove}>
                        <HierarchyButton
                            onClick={handleToMove}
                            active={isMoving}
                            light={light}
                            title="Move in hierarchy"
                        >
                            <MdOutlineDriveFileMove />
                        </HierarchyButton>
                    </If>
                    <If cond={nodeToMove && !isMoving}>
                        <HierarchyButton
                            onClick={handleToMove}
                            active={isMoving}
                            light={light}
                            title="Move here in hierarchy"
                        >
                            <MdDriveFileMoveRtl />
                        </HierarchyButton>
                    </If>
                    <If cond={isMoving}>
                        <HierarchyButton
                            onClick={handleToMove}
                            active={isMoving}
                            light={light}
                            title="End Move"
                        >
                            <BsFillStopFill />
                        </HierarchyButton>
                    </If>
                </If>
                <If cond={!nodeToMove}>
                    <HierarchyButton
                        active={isLinking}
                        light={light}
                        onClick={handleLink}
                        title="Link to selected rows in table"
                    >
                        <VscJson />
                    </HierarchyButton>
                </If>
            </HierarchyNode>
            {open && (
                <GroupNodeChildren {...props} nodeToMove={nodeToMove} nodeToLink={nodeToLink} />
            )}
        </HierarchyNodeGroup>
    );
}
