import React from 'react';

import { context, rowType } from '@context/TablesContext';

export function useTableSetRowType() {
    const ctx = React.useContext(context);

    const setRowType = (row: number, rowType: rowType) => {
        const tableCopy = [...ctx.rowTypes];
        const sheetCopy = [...tableCopy[ctx.activeSheet]];
        sheetCopy[row] = rowType;
        tableCopy[ctx.activeSheet] = sheetCopy;
        ctx.setRowTypes(tableCopy);
    };

    return setRowType;
}
