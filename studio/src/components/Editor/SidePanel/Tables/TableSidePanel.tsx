import { ColumnContainer, OverflowAbsoluteContainer, StretchContainer } from '@elements/Containers';

import { TableMenu } from './TableMenu';
import { TablesSheetList } from './Tables/SheetList';
import { Tables } from './Tables/Tables';

export function TableSidePanel() {
    return (
        <ColumnContainer>
            <TableMenu />
            <StretchContainer>
                <OverflowAbsoluteContainer>
                    <Tables />
                </OverflowAbsoluteContainer>
            </StretchContainer>
            <TablesSheetList />
        </ColumnContainer>
    );
}
