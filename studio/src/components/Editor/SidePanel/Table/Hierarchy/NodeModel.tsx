import React from 'react';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import { ModelNode as ModelNodeClass } from '@utils/hierarchy/graph';
import { EditorModel } from '@utils/models/EditorModel';

import { EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';

import {
    HierarchyButton,
    HierarchyMainButton,
    HierarchyNodeRow,
    colorNodeBackground,
} from '@elements/Hierarchy';

type ModelNodeProps = {
    model: EditorModel;
    submodels: Set<number>;
    node: ModelNodeClass;
};

export function ModelNode(props: ModelNodeProps) {
    const { model, submodels, node } = props;
    const { select } = React.useContext(EditorContext);
    const { nodeToMove, setNodeToMove } = React.useContext(TablesContext);

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
                    <HierarchyButton onClick={handleToMove} bg={bg} title="Move in hierarchy">
                        <MdOutlineDriveFileMove />
                    </HierarchyButton>
                )}
            </HierarchyNodeRow>
        );
    return null;
}
