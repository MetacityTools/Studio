import React from 'react';

import { StyleNode } from '@utils/types';

import { HierarchyTitle } from '@elements/Hierarchy';

import { useApplyStyle, useStyleKeychain } from '@shared/Context/hooks';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';
import { StyleInfo } from '@shared/Style/StyleInfo';

export function StyleEditor() {
    const [openList, setOpenList] = React.useState<boolean>(false);
    const applyStyle = useApplyStyle();
    const keychain = useStyleKeychain();

    const handlePick = (root: StyleNode, node: StyleNode) => {
        applyStyle(root, node);
        setOpenList(false);
    };

    return (
        <>
            <div className="w-full relative h-8">
                <button
                    className="absolute w-full px-2 flex flex-row items-center ellipsis overflow-hidden whitespace-nowrap button-list"
                    onClick={() => setOpenList((e) => !e)}
                >
                    <span className="mr-2 text-neutral-500">Selected:</span>
                    <HierarchyTitle categories={keychain ?? ['Select a style ']} />
                </button>
            </div>
            {openList && (
                <div className="w-full h-full">
                    <StyleHierarchy onValuePick={handlePick} />
                </div>
            )}
            {!openList && <StyleInfo />}
        </>
    );
}
