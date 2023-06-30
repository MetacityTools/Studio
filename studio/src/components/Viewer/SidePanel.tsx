import React from 'react';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

import { IOMenu } from '@shared/IOMenu/IOMenu';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

export function SidePanel() {
    const onValuePick = (value: MetadataNode) => {
        //TODO
    };

    return (
        <ColumnContainer>
            <IOMenu />
            <StretchContainer className="border-t">
                <OverflowAbsoluteContainer className="p-4">
                    <MetadataHierarchy onValuePick={onValuePick} />
                </OverflowAbsoluteContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
