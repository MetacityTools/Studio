import React from 'react';
import { parse } from 'tablests';

import { context } from '@context/TablesContext';

export function useTableAddSheet() {
    const ctx = React.useContext(context);

    const addSheet = (contents: string) => {
        const parsed = parse(contents);
        const tableCopy = [...ctx.sheets];
        tableCopy.push(parsed);
        const rowTypesCopy = [...ctx.rowTypes];
        rowTypesCopy.push(parsed.map(() => 'value'));
        ctx.setSheets(tableCopy);
        ctx.setRowTypes(rowTypesCopy);
    };

    return addSheet;
}
