import React from 'react';

import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useMetadata } from '@hooks/useMetadata';
import { useMetadatHeatmap } from '@hooks/useMetadataHeatmap';

import { TablesSheetList } from './TableList';
import { Tables } from './Tables';

export function TableSidePanel() {
    const [applyHeatmap, resetHeatmap] = useMetadatHeatmap();
    const metadata = useMetadata();

    React.useEffect(() => {
        applyHeatmap();
    }, [metadata]);

    React.useEffect(() => {
        applyHeatmap();
        return () => {
            resetHeatmap();
        };
    }, []);

    return (
        <ColumnContainer>
            <PanelTitle title="Imported Tables" />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <Tables />
                </OverflowAbsoluteContainer>
            </StretchContainer>
            <TablesSheetList />
        </ColumnContainer>
    );
}
