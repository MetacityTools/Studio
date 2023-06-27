import React from 'react';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

import { useStyleKeychain } from '@shared/Context/styles';
import { IOMenu } from '@shared/IOMenu/IOMenu';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

export function SidePanel() {
    const [styleKeychain, setStyleKeychain] = useStyleKeychain();

    React.useEffect(() => {
        return () => {
            setStyleKeychain([]);
        };
    }, []);

    const onValuePick = (value: MetadataNode) => {
        setStyleKeychain(value);
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
