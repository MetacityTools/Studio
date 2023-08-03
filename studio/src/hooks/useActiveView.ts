import React from 'react';

import { context } from '@context/ViewContext';

export function useActiveView(): number {
    const ctx = React.useContext(context);
    return ctx.activeView;
}
