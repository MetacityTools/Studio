import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { TablesSheetList } from './Tables/SheetList';
import { Tables } from './Tables/Tables';

export function TableSidePanel() {
    return (
        <ColumnContainer>
            <PanelTitle title="Tables" />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <Tables />
                </OverflowAbsoluteContainer>
            </StretchContainer>
            <TablesSheetList />
        </ColumnContainer>
    );
}
