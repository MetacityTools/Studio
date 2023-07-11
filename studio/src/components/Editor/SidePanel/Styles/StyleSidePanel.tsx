import { Allotment } from 'allotment';
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
            <StretchContainer>
                <Allotment separator={false} vertical>
                    <Allotment.Pane preferredSize={400} minSize={200}>
                        <ColumnContainer>
                            <PanelTitle title="Styles" />
                            TODO list styles
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={800} minSize={200} className="border-t">
                        <ColumnContainer>
                            <PanelTitle title="Style Editor" />
                            <StretchContainer>
                                <OverflowAbsoluteContainer>
                                    <StyleEditor />
                                </OverflowAbsoluteContainer>
                            </StretchContainer>
                            <BottomRowContainer>
                                <Status status={status} />
                                <button
                                    className="text-neutral-400 hover:bg-neutral-200 px-1 py-0 my-0"
                                    onClick={handleAutoStyle}
                                >
                                    apply auto style
                                </button>
                            </BottomRowContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
