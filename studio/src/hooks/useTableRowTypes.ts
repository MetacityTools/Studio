import React from 'react';

import { context } from '@context/TablesContext';

export function useTableRowTypes() {
    const ctx = React.useContext(context);
    const types = ctx.rowTypes[ctx.activeSheet];
    if (!types) return;
    return types;
}
