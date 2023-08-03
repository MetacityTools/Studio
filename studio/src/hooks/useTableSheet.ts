import React from 'react';

import { context } from '@context/TablesContext';

export function useTableSheet() {
    const ctx = React.useContext(context);

    const getSheet = (index: number) => {
        const sheet = ctx.sheets[index];
        if (!sheet) return;
        const rowTypes = ctx.rowTypes[index];
        return { sheet, rowTypes };
    };

    return getSheet;
}
