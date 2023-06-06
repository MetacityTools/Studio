import React from 'react';
import { BsFillStopFill } from 'react-icons/bs';
import { MdOutlineDriveFileMove } from 'react-icons/md';
import { VscSymbolInterface } from 'react-icons/vsc';

import { EditorModel, ModelNode as ModelNodeClass } from '@utils/utils';
import { useSelection } from '@utils/utils';

import { useLinkingNode, useMovingNode } from '@editor/Context/TableContext';

import {
    HierarchyButton,
    HierarchyMainButton,
    HierarchyNodeRow,
    colorNodeBackground,
} from '@elements/Hierarchy';
import { If } from '@elements/If';

type ModelNodeProps = {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelNodeClass;
};

export function ModelNode(props: ModelNodeProps) {
    const { model, submodels, node } = props;
    const [select] = useSelection();
    const [nodeToMove, updateNodeToMove] = useMovingNode();
    const [nodeToLink, updatenodeToLink] = useLinkingNode();

    const isSelected = React.useMemo(() => node.selected(submodels), [node, submodels]);
    const isMoving = React.useMemo(() => node === nodeToMove, [node, nodeToMove]);
    const isLinking = React.useMemo(() => node === nodeToLink, [node, nodeToLink]);

    const handleSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        select(model, [node.submodelId!], true, true);
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

    const bg = colorNodeBackground(isSelected, isMoving || isLinking);
    const bgMoving = colorNodeBackground(isMoving, isSelected || isLinking);
    const bgLinking = colorNodeBackground(isLinking, isSelected || isMoving);

    if (isSelected || isMoving || isLinking)
        return (
            <HierarchyNodeRow>
                <HierarchyMainButton onClick={handleSelect} bg={bg} padded>
                    Model {node.submodelId}
                </HierarchyMainButton>
                <If cond={!nodeToMove}>
                    <HierarchyButton onClick={handleToMove} bg={bgMoving} title="Move in hierarchy">
                        <MdOutlineDriveFileMove />
                    </HierarchyButton>
                </If>
                <If cond={isMoving}>
                    <HierarchyButton onClick={handleToMove} bg={bgMoving} title="Drop moving">
                        <BsFillStopFill />
                    </HierarchyButton>
                </If>
                <If cond={!nodeToMove}>
                    <HierarchyButton
                        bg={bgLinking}
                        onClick={handleLink}
                        title="Link to selected rows in table"
                    >
                        <VscSymbolInterface />
                    </HierarchyButton>
                </If>
            </HierarchyNodeRow>
        );
    return null;
}
