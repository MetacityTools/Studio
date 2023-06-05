import React from 'react';
import { BiLink } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { MdDriveFileMoveRtl, MdOutlineDriveFileMove } from 'react-icons/md';

import { EditorModel, GroupNode as GroupNodeClass, deleteGroup } from '@utils/utils';

import { EditorContext } from '@editor/Context/EditorContext';
import { TablesContext } from '@editor/Context/TableContext';

import {
    HierarchyButton,
    HierarchyChevronButton,
    HierarchyMainButton,
    HierarchyNodeRow,
    colorNodeBackground,
} from '@elements/Hierarchy';

import { GroupNodeChildren } from './NodeGroupChildren';

export interface GroupNodeProps {
    model: EditorModel;
    submodels: Set<number>;
    node: GroupNodeClass;
}

export function GroupNode(props: GroupNodeProps) {
    const { model, node, submodels } = props;
    const [open, setOpen] = React.useState(false);
    const { select } = React.useContext(EditorContext);
    const { graph, nodeToMove, setNodeToMove, activeRows } = React.useContext(TablesContext);

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

    const handleLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //todo
        e.stopPropagation();
    };

    const bg = colorNodeBackground(node.selected(submodels), nodeToMove === node);
    const recordAvailable = activeRows.size > 0;

    return (
        <div className="flex flex-col rounded-md">
            <HierarchyNodeRow>
                <HierarchyChevronButton open={open} onClick={handleOpen} bg={bg} />
                <HierarchyMainButton onClick={handleSelect} bg={bg}>
                    Group of {node.children.length} parts
                </HierarchyMainButton>
                <HierarchyButton bg={bg} onClick={handleRemove} title="Delete group">
                    <FiDelete />
                </HierarchyButton>
                {!isDescendantOfSelected && (
                    <HierarchyButton
                        bg={bg}
                        onClick={handleToMove}
                        title={nodeToMove ? 'Move here in hierarchy' : 'Move in hierarchy'}
                    >
                        {nodeToMove ? <MdDriveFileMoveRtl /> : <MdOutlineDriveFileMove />}
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
            {open && <GroupNodeChildren {...props} nodeToMove={nodeToMove} />}
        </div>
    );
}
