import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { StyleNode } from '@utils/utils';

import { ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useApplyStyle } from '@shared/Context/hooks';
import { StyleHierarchy } from '@shared/Style/StyleHierarchy';
import { StyleInfo } from '@shared/Style/StyleInfo';

export function StyleSidePanel() {
    const [, applyStyle, clearStyle] = useApplyStyle();

    const handlePick = (root: StyleNode, node: StyleNode) => {
        applyStyle(root, node);
    };

    React.useEffect(() => {
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
                    <Allotment.Pane preferredSize={400} minSize={20} className="border-t">
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
