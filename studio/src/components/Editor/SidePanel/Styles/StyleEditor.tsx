import React from 'react';

import { StyleNode } from '@utils/types';
import { autoUpdateStyle } from '@utils/utils';

import { HierarchyTitle } from '@elements/Hierarchy';

import { useApplyStyle, useLastStyle, useMetadata, useStyle } from '@shared/Context/hooks';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';
import { StyleInfo } from '@shared/Style/StyleInfo';

export function StyleEditor() {
    const [openList, setOpenList] = React.useState<boolean>(false);
    const [style, setStyle] = useStyle();
    const [, applyStyle] = useApplyStyle();
    const [metadata] = useMetadata();
    const [keychain] = useApplyStyle();

    const handleAutoStyle = () => {
        const updated = autoUpdateStyle(metadata, style);
        setStyle(updated);
    };

    const handlePick = (root: StyleNode, node: StyleNode) => {
        applyStyle(root, node);
        setOpenList(false);
    };

    return (
        <>
            <div className="w-full relative h-8">
                <button
                    className="absolute w-full px-2 flex flex-row items-center ellipsis overflow-hidden whitespace-nowrap hover:bg-neutral-100 dark:hover:bg-neutral-700"
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
