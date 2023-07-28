import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { StyleNode, autoUpdateStyle } from '@utils/utils';

import { BottomRowContainer, ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useApplyStyle, useLastStyle, useMetadata, useStyle } from '@shared/Context/hooks';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';
import { StyleInfo } from '@shared/Style/StyleInfo';

export function StyleSidePanel() {
    const [style, setStyle] = useStyle();
    const [, applyStyle, clearStyle] = useApplyStyle();
    const [, applyLastStyle] = useLastStyle();
    const [metadata] = useMetadata();

    const handleAutoStyle = () => {
        const updated = autoUpdateStyle(metadata, style);
        setStyle(updated);
    };

    const handlePick = (root: StyleNode, node: StyleNode) => {
        applyStyle(root, node);
    };

    React.useEffect(() => {
        applyLastStyle();
        return () => {
            clearStyle();
        };
    }, []);

    return (
        <ColumnContainer>
            <StretchContainer>
                <Allotment separator={false} vertical>
                    <Allotment.Pane preferredSize={400} minSize={20}>
                        <ColumnContainer>
                            <PanelTitle title="Active Style" />
                            <StyleInfo />
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={400} minSize={20} className="border-t mc-border">
                        <ColumnContainer>
                            <PanelTitle title="Style Outline" />
                            <StyleHierarchy onValuePick={handlePick} />
                            <BottomRowContainer>
                                <button
                                    onClick={handleAutoStyle}
                                    className="text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-400"
                                >
                                    Auto-add missing styles
                                </button>
                            </BottomRowContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
