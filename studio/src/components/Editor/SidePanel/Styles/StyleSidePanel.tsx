import 'allotment/dist/style.css';
import React from 'react';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowContainer, StretchContainer } from '@elements/Containers';

import { useStyleKeychain } from '@shared/Context/styles';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

export function StyleSidePanel() {
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
            <StretchContainer>
                <OverflowContainer className="p-4">
                    <MetadataHierarchy onValuePick={onValuePick} />
                </OverflowContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
