import { Style } from 'data/types';
import React from 'react';

import { OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { TitleChain } from '@elements/TitleChain';

import { useApplyStyle } from '@hooks/useApplyStyle';
import { useStyleKeychain } from '@hooks/useStyleKeychain';

import { StyleDetail } from './StyleDetail';
import { StyleList } from './StyleList';

export function StylePanel() {
    const [openList, setOpenList] = React.useState<boolean>(false);
    const [applyStyle] = useApplyStyle();
    const keychain = useStyleKeychain();

    const handlePick = (root: Style, node: Style) => {
        applyStyle(root, node);
        setOpenList(false);
    };

    return (
        <>
            <div className="w-full relative h-8">
                <button
                    className="absolute w-full px-2 h-8 flex flex-row items-center ellipsis overflow-hidden whitespace-nowrap button-list"
                    onClick={() => setOpenList((e) => !e)}
                >
                    <span className="mr-2 text-neutral-500">Selected:</span>
                    <TitleChain categories={keychain ?? ['Select a style ']} />
                </button>
            </div>
            <StretchContainer>
                {openList && (
                    <OverflowAbsoluteContainer>
                        <StyleList onValuePick={handlePick} />
                    </OverflowAbsoluteContainer>
                )}
                {!openList && (
                    <OverflowAbsoluteContainer>
                        <StyleDetail />
                    </OverflowAbsoluteContainer>
                )}
            </StretchContainer>
        </>
    );
}
