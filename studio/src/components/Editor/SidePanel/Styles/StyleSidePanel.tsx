import 'allotment/dist/style.css';
import React from 'react';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { StyleEditor } from './StyleEditor';

export function StyleSidePanel() {
    return (
        <ColumnContainer>
            <PanelTitle title="Style Editor" />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <StyleEditor />
                </OverflowAbsoluteContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
