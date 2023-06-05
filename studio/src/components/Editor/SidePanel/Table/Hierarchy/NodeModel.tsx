import React from 'react';
import { BiLink } from 'react-icons/bi';
import { MdOutlineDriveFileMove } from 'react-icons/md';

import { EditorModel, ModelNode as ModelNodeClass } from '@utils/utils';

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
    const { nodeToMove, setNodeToMove, activeRows } = React.useContext(TablesContext);

    const selectModel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        select(model, [node.submodelId!], true, true);
        e.stopPropagation();
    };

    const handleToMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setNodeToMove(node);
    };

    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //todo
        e.stopPropagation();
    };

    const active = submodels.has(node.submodelId) || nodeToMove === node;
    const bg = colorNodeBackground(submodels.has(node.submodelId), nodeToMove === node);
    const recordAvailable = activeRows.size > 0;

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
                <HierarchyButton
                    bg={bg}
                    onClick={handleLink}
                    title="Link to selected rows in table"
                    disabled={!recordAvailable}
                >
                    <BiLink />
                </HierarchyButton>
            </HierarchyNodeRow>
        );
    return null;
}
