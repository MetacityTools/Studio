import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import React from 'react';

import { MetadataNode } from '@utils/types';

import { ColumnContainer, OverflowContainer, StretchContainer } from '@elements/Containers';

import { useStyleKeychain } from '@shared/Context/styles';
import { MetadataHierarchy } from '@shared/Metadata/MetadataHierarchy';

import { StyleDetailPanel } from './StyleDetail';

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
                <Allotment separator={false}>
                    <Allotment.Pane preferredSize={400} minSize={250}>
                        <OverflowContainer className="p-4">
                            <MetadataHierarchy onValuePick={onValuePick} />
                        </OverflowContainer>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={800} className="border-l">
                        <StyleDetailPanel />
                    </Allotment.Pane>
                </Allotment>
            </StretchContainer>
        </ColumnContainer>
    );
}
