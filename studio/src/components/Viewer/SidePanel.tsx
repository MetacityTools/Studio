import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

import { IOMenu } from '@shared/IOMenu/IOMenu';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

export function SidePanel() {
    const onValuePick = (value: MetadataNode) => {
        console.log(value);
    };

    return (
        <ColumnContainer>
            <IOMenu />
            <StretchContainer>TODO</StretchContainer>
        </ColumnContainer>
    );
}
