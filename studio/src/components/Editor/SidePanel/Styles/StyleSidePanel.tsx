import 'allotment/dist/style.css';
import React from 'react';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

export function StyleSidePanel() {
    return (
        <ColumnContainer>
            <StretchContainer>
                <OverflowAbsoluteContainer className="p-4">TODO</OverflowAbsoluteContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
