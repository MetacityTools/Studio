import React from 'react';

import { context } from '@context/TablesContext';

export function useTableSheet() {
    const ctx = React.useContext(context);
    const sheet = ctx.sheets[ctx.activeSheet];
    if (!sheet) return;
    return sheet;
}
