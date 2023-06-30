import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

import { TablesSheetList } from './Tables/SheetList';
import { Tables } from './Tables/Tables';

export function TableSidePanel() {
    return (
        <ColumnContainer>
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <Tables />
                </OverflowAbsoluteContainer>
            </StretchContainer>
            <TablesSheetList />
        </ColumnContainer>
    );
}
