import React from 'react';
import { BsFillStopFill } from 'react-icons/bs';
import { MdOutlineDriveFileMove } from 'react-icons/md';
import { VscJson } from 'react-icons/vsc';

import { ModelNode as ModelNodeClass, SelectionType } from '@utils/utils';
import { useSelection } from '@utils/utils';

import { useEditingNode, useMovingNode } from '@editor/Context/TableContext';

import { HierarchyButton, HierarchyMainButton, HierarchyNode } from '@elements/Hierarchy';
import { If } from '@elements/If';

type ModelNodeProps = {
    selectedModels: SelectionType;
    node: ModelNodeClass;
};

export function ModelNode(props: ModelNodeProps) {
    const { selectedModels, node } = props;
    const [select] = useSelection();
    const [nodeToMove, updateNodeToMove] = useMovingNode();
    const [nodeToLink, updatenodeToLink] = useEditingNode();

    const isSelected = React.useMemo(() => node.selected(selectedModels), [node, selectedModels]);
    const isMoving = React.useMemo(() => node === nodeToMove, [node, nodeToMove]);
    const isLinking = React.useMemo(() => node === nodeToLink, [node, nodeToLink]);

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const s: SelectionType = new Map([[node.model, new Set([node.submodelId!])]]);
        select(s, true, true);
        e.stopPropagation();
    };

    const handleToMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updateNodeToMove(node);
        e.stopPropagation();
    };

    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        updatenodeToLink(node);
        e.stopPropagation();
    };

    const light = isSelected || isMoving || isLinking;

    return (
        <HierarchyNode>
            <HierarchyMainButton onClick={handleSelect} light={light} active={isSelected} padded>
                Model {node.submodelId}
            </HierarchyMainButton>
            <If cond={!nodeToMove}>
                <HierarchyButton
                    onClick={handleToMove}
                    light={light}
                    active={isMoving}
                    title="Move in hierarchy"
                >
                    <MdOutlineDriveFileMove />
                </HierarchyButton>
            </If>
            <If cond={isMoving}>
                <HierarchyButton
                    onClick={handleToMove}
                    light={light}
                    active={isMoving}
                    title="End Move"
                >
                    <BsFillStopFill />
                </HierarchyButton>
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
    );
}
