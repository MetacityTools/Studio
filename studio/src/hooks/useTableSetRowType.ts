import React from 'react';

import { context, rowType } from '@context/TablesContext';

export function useTableSetRowType() {
    const ctx = React.useContext(context);

    const setRowType = (sheet: number, row: number, rowType: rowType) => {
        const tableCopy = [...ctx.rowTypes];
        const sheetCopy = [...tableCopy[sheet]];
        sheetCopy[row] = rowType;
        tableCopy[sheet] = sheetCopy;
        ctx.setRowTypes(tableCopy);
    };

    return setRowType;
}
