import React from 'react';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import { ModelNode } from '@utils/hierarchy/graph';
import { EditorModel } from '@utils/models/models/EditorModel';

import { EditorContext, HierarchyContext } from '@editor/Context';

import {
    HierarchyButton,
    HierarchyMainButton,
    HierarchyNodeRow,
    colorNodeBackground,
} from '@elements/Hierarchy';

type ModelNodePanelProps = {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelNode;
};

export function ModelNodePanel(props: ModelNodePanelProps) {
    const { model, submodels, node } = props;
    const ctx = React.useContext(EditorContext);
    const { select } = ctx;
    const hierarchyCtx = React.useContext(HierarchyContext);
    const { nodeToMove, setNodeToMove } = hierarchyCtx;

    const selectModel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        select(model, [node.submodelId!], true, true);
        e.stopPropagation();
    };

    const handleToMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setNodeToMove(node);
    };

    const active = submodels.has(node.submodelId) || nodeToMove === node;
    const bg = colorNodeBackground(submodels.has(node.submodelId), nodeToMove === node);

    if (active)
        return (
            <HierarchyNodeRow>
                <HierarchyMainButton onClick={selectModel} bg={bg} padded>
                    Model {node.submodelId}
                </HierarchyMainButton>
                {!nodeToMove && (
                    <HierarchyButton onClick={handleToMove} bg={bg}>
                        <MdOutlineDriveFileMove />
                    </HierarchyButton>
                )}
            </HierarchyNodeRow>
        );
    return null;
}
