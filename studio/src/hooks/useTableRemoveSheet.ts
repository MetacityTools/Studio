import React from 'react';

import { context } from '@context/TablesContext';

export function useTableRemoveSheet() {
    const ctx = React.useContext(context);

    const removeSheet = (index: number) => {
        const tableCopy = [...ctx.sheets];
        tableCopy.splice(index, 1);
        const rowTypesCopy = [...ctx.rowTypes];
        rowTypesCopy.splice(index, 1);
        ctx.setSheets(tableCopy);
        ctx.setRowTypes(rowTypesCopy);
    };

    return removeSheet;
}
