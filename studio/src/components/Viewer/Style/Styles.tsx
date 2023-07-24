import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { StyleNode } from '@utils/utils';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useApplyStyle, useLastStyle } from '@shared/Context/hooks';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';
import { StyleInfo } from '@shared/Style/StyleInfo';

export function StyleSidePanel() {
    const [, applyStyle, clearStyle] = useApplyStyle();
    const [, applyLastStyle] = useLastStyle();

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
                            <StretchContainer>
                                <OverflowAbsoluteContainer>
                                    <StyleInfo />
                                </OverflowAbsoluteContainer>
                            </StretchContainer>
                        </ColumnContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={400} minSize={20} className="border-t mc-border">
                        <ColumnContainer>
                            <PanelTitle title="Style Outline" />
                            <StyleHierarchy onValuePick={handlePick} />
                        </ColumnContainer>
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
