import React from 'react';

import { context } from '@context/TablesContext';

export function useTabelsEmpty() {
    const ctx = React.useContext(context);
    return ctx.sheets.length === 0;
}
