import React from 'react';

import { context } from '@context/TablesContext';

export function useTableSheetCount() {
    const ctx = React.useContext(context);
    return ctx.sheets.length;
}
