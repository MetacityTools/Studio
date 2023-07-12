import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';
import { FaBrush } from 'react-icons/fa';

import { StyleNode, autoUpdateStyle } from '@utils/utils';

import { useStatus } from '@editor/EditorContext';

import {
    BottomRowContainer,
    ColumnContainer,
    OverflowAbsoluteContainer,
    StretchContainer,
} from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useApplyStyle, useMetadata, useStyle } from '@shared/Context/hooks';
import { Status } from '@shared/Status';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';

import { StyleEditor } from './StyleEditor';

export function StyleSidePanel() {
    const [style, setStyle] = useStyle();
    const applyStyle = useApplyStyle();
    const [status, setStatus] = useStatus();
    const [metadata] = useMetadata();

    const handleAutoStyle = () => {
        const updated = autoUpdateStyle(metadata, style);
        setStyle(updated);
    };

    React.useEffect(() => {
        return () => {
            setStatus(undefined);
        };
    }, []);

    const handlePick = (root: StyleNode, node: StyleNode) => {
        applyStyle(root, node);
    };

    return (
        <ColumnContainer>
            <StretchContainer>
                <Allotment separator={false} vertical>
                    <Allotment.Pane preferredSize={400} minSize={200}>
                        <ColumnContainer>
                            <PanelTitle title="Style Outline" />
                            <StyleHierarchy onValuePick={handlePick} />
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={800} minSize={200} className="border-t">
                        <ColumnContainer>
                            <PanelTitle title="Style Editor" />
                            <ColumnContainer>
                                <StretchContainer>
                                    <OverflowAbsoluteContainer>
                                        <StyleEditor />
                                    </OverflowAbsoluteContainer>
                                </StretchContainer>
                                <BottomRowContainer>
                                    <Status status={status} />
                                    <button
                                        onClick={handleAutoStyle}
                                        className="text-neutral-400 hover:text-neutral-800"
                                    >
                                        Apply auto style
                                    </button>
                                </BottomRowContainer>
                            </ColumnContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
