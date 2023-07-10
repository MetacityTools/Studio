import 'allotment/dist/style.css';
import React from 'react';
import { FaBrush } from 'react-icons/fa';

import { autoUpdateStyle } from '@utils/utils';

import { useStatus } from '@editor/EditorContext';

import {
    BottomRowContainer,
    ColumnContainer,
    OverflowAbsoluteContainer,
    StretchContainer,
} from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useMetadata, useStyle } from '@shared/Context/hooks';
import { Status } from '@shared/Status';

import { StyleEditor } from './StyleEditor';

export function StyleSidePanel() {
    const [style, setStyle] = useStyle();
    const [status] = useStatus();
    const [metadata] = useMetadata();

    const handleAutoStyle = () => {
        const updated = autoUpdateStyle(metadata, style);
        setStyle(updated);
    };

    return (
        <ColumnContainer>
            <PanelTitle title="Style Editor" />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <StyleEditor />
                </OverflowAbsoluteContainer>
            </StretchContainer>
            <BottomRowContainer className="flex flex-row items-center">
                <button
                    className="flex flex-row items-center text-neutral-400 hover:bg-neutral-200 px-2"
                    onClick={handleAutoStyle}
                >
                    <FaBrush className="mr-2" />
                    apply auto style
                </button>
                <Status status={status} />
            </BottomRowContainer>
        </ColumnContainer>
    );
}
