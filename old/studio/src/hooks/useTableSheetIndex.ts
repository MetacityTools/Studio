import React from 'react';

import { context } from '@context/TablesContext';

export function useTableSheetIndex(): [number, React.Dispatch<React.SetStateAction<number>>] {
    const ctx = React.useContext(context);
    return [ctx.activeSheet, ctx.setActiveSheet];
}
