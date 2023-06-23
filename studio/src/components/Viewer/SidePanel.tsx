import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

import { IOMenu } from '@shared/IOMenu/IOMenu';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

import { useStyle } from './Context/ViewerContext';

export function SidePanel() {
    const [style, setStyle] = useStyle();

    const onValuePick = (value: MetadataNode) => {
        setStyle(value);
        console.log(value);
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
