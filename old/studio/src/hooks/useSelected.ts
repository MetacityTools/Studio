import React from 'react';

import { SelectionType, context } from '@context/ViewContext';

export function useSelected(): SelectionType {
    const ctx = React.useContext(context);
    return ctx.selection;
}
